const {
  QueryCommand,
  PutItemCommand,
  GetItemCommand,
  UpdateItemCommand,
  DeleteItemCommand,
} = require('@aws-sdk/client-dynamodb');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const client = require('../../config/dynamoClient');
const env = require('../../config/env');
const TABLES = require('../../database/tables');
const { comparePassword } = require('../../utils/hash');
const { generateAccessToken, generateRefreshToken } = require('../../utils/jwt');
const { generateOtpCode, hashOtp, verifyOtpHash, otpExpiresAtMs } = require('../../utils/otp');
const { sendOtpViaWhatsApp } = require('../../services/whatsapp.service');
const AppError = require('../../utils/appError');

const RESEND_COOLDOWN_MS = 30 * 1000;

function mapUser(item) {
  return {
    userId: item.userId.S,
    phone: item.phone.S,
    name: item.name?.S || '',
    email: item.email?.S || '',
    role: item.role?.S || 'customer',
  };
}

async function findUserByPhone(phone) {
  const result = await client.send(
    new QueryCommand({
      TableName: TABLES.USERS,
      IndexName: 'phone-index',
      KeyConditionExpression: 'phone = :phone',
      ExpressionAttributeValues: { ':phone': { S: phone } },
    })
  );
  return result.Items?.[0] || null;
}

async function storeSession(refreshToken, userId, userType) {
  await client.send(
    new PutItemCommand({
      TableName: TABLES.SESSIONS,
      Item: {
        tokenId: { S: uuidv4() },
        refreshToken: { S: refreshToken },
        userId: { S: userId },
        userType: { S: userType },
        createdAt: { S: new Date().toISOString() },
      },
    })
  );
}

function issueTokens(userId, role, userType) {
  const payload = { userId, role, userType };
  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
    payload,
  };
}

// ─── Admin ───────────────────────────────────────────────────────────────────

exports.adminLoginService = async (email, password) => {
  const result = await client.send(
    new QueryCommand({
      TableName: TABLES.ADMINS,
      IndexName: 'email-index',
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: { ':email': { S: email.trim().toLowerCase() } },
    })
  );

  if (!result.Items?.length) {
    throw new AppError('Invalid email or password', 401);
  }

  const admin = result.Items[0];

  if (admin.role.S !== 'admin') {
    throw new AppError('Unauthorized access', 403);
  }

  const isMatch = await comparePassword(password, admin.password.S);
  if (!isMatch) {
    throw new AppError('Invalid email or password', 401);
  }

  const { accessToken, refreshToken, payload } = issueTokens(
    admin.adminId.S,
    admin.role.S,
    'admin'
  );

  await storeSession(refreshToken, payload.userId, 'admin');

  const normalizedEmail = email.trim().toLowerCase();

  return {
    accessToken,
    refreshToken,
    user: {
      userId: payload.userId,
      role: payload.role,
      email: normalizedEmail,
      name: admin.name?.S || 'Admin',
    },
  };
};

// ─── Customer OTP ────────────────────────────────────────────────────────────

exports.sendOtpService = async (phone, mode) => {
  const existingUser = await findUserByPhone(phone);

  if (mode === 'login' && !existingUser) {
    throw new AppError('No account found for this number. Please sign up first.', 404);
  }

  if (mode === 'signup' && existingUser) {
    throw new AppError('An account already exists with this number. Please log in.', 409);
  }

  const existingOtp = await client.send(
    new GetItemCommand({
      TableName: TABLES.OTPS,
      Key: { phone: { S: phone } },
    })
  );

  if (existingOtp.Item?.createdAt?.S) {
    const lastSent = new Date(existingOtp.Item.createdAt.S).getTime();
    if (Date.now() - lastSent < RESEND_COOLDOWN_MS) {
      throw new AppError('Please wait before requesting another OTP', 429);
    }
  }

  const otp = generateOtpCode();

  await sendOtpViaWhatsApp(phone, otp);

  const now = new Date().toISOString();
  await client.send(
    new PutItemCommand({
      TableName: TABLES.OTPS,
      Item: {
        phone: { S: phone },
        otpHash: { S: hashOtp(otp, phone) },
        expiresAt: { N: String(otpExpiresAtMs()) },
        attempts: { N: '0' },
        mode: { S: mode || 'any' },
        createdAt: { S: now },
      },
    })
  );

  return { message: 'OTP sent successfully' };
};

exports.verifyOtpService = async (phone, otpCode) => {
  const record = await client.send(
    new GetItemCommand({
      TableName: TABLES.OTPS,
      Key: { phone: { S: phone } },
    })
  );

  if (!record.Item) {
    throw new AppError('OTP expired or not found. Please request a new code.', 400);
  }

  const expiresAt = Number(record.Item.expiresAt.N);
  if (Date.now() > expiresAt) {
    await client.send(
      new DeleteItemCommand({
        TableName: TABLES.OTPS,
        Key: { phone: { S: phone } },
      })
    );
    throw new AppError('OTP has expired. Please request a new code.', 400);
  }

  let attempts = Number(record.Item.attempts?.N || 0);
  const storedHash = record.Item.otpHash.S;
  const valid = verifyOtpHash(otpCode, phone, storedHash);

  if (!valid) {
    attempts += 1;
    if (attempts >= env.otpMaxAttempts) {
      await client.send(
        new DeleteItemCommand({
          TableName: TABLES.OTPS,
          Key: { phone: { S: phone } },
        })
      );
      throw new AppError('Too many incorrect attempts. Please request a new OTP.', 429);
    }

    await client.send(
      new UpdateItemCommand({
        TableName: TABLES.OTPS,
        Key: { phone: { S: phone } },
        UpdateExpression: 'SET attempts = :a',
        ExpressionAttributeValues: { ':a': { N: String(attempts) } },
      })
    );
    throw new AppError('Incorrect OTP. Please try again.', 401);
  }

  await client.send(
    new DeleteItemCommand({
      TableName: TABLES.OTPS,
      Key: { phone: { S: phone } },
    })
  );

  const storedMode = record.Item.mode?.S;
  let userItem = await findUserByPhone(phone);
  let isNewUser = false;

  if (!userItem) {
    if (storedMode === 'login') {
      throw new AppError('No account found for this number. Please sign up first.', 404);
    }

    const userId = uuidv4();
    const now = new Date().toISOString();
    await client.send(
      new PutItemCommand({
        TableName: TABLES.USERS,
        Item: {
          userId: { S: userId },
          phone: { S: phone },
          role: { S: 'customer' },
          name: { S: '' },
          email: { S: '' },
          createdAt: { S: now },
          updatedAt: { S: now },
        },
      })
    );
    userItem = {
      userId: { S: userId },
      phone: { S: phone },
      role: { S: 'customer' },
      name: { S: '' },
      email: { S: '' },
    };
    isNewUser = true;
  }

  const { accessToken, refreshToken, payload } = issueTokens(
    userItem.userId.S,
    'customer',
    'customer'
  );

  await storeSession(refreshToken, payload.userId, 'customer');

  return {
    accessToken,
    refreshToken,
    isNewUser,
    user: mapUser(userItem),
  };
};

exports.registerCustomerService = async (userId, name, email) => {
  const now = new Date().toISOString();

  await client.send(
    new UpdateItemCommand({
      TableName: TABLES.USERS,
      Key: { userId: { S: userId } },
      UpdateExpression: 'SET #n = :name, email = :email, updatedAt = :u',
      ExpressionAttributeNames: { '#n': 'name' },
      ExpressionAttributeValues: {
        ':name': { S: name },
        ':email': { S: email || '' },
        ':u': { S: now },
      },
    })
  );

  const updated = await client.send(
    new GetItemCommand({
      TableName: TABLES.USERS,
      Key: { userId: { S: userId } },
    })
  );

  return { user: mapUser(updated.Item) };
};

// ─── Tokens ──────────────────────────────────────────────────────────────────

exports.refreshTokenService = async (refreshToken) => {
  let decoded;
  try {
    decoded = jwt.verify(refreshToken, env.jwtRefreshSecret);
  } catch {
    throw new AppError('Invalid or expired refresh token', 401);
  }

  const result = await client.send(
    new QueryCommand({
      TableName: TABLES.SESSIONS,
      IndexName: 'refreshToken-index',
      KeyConditionExpression: 'refreshToken = :rt',
      ExpressionAttributeValues: { ':rt': { S: refreshToken } },
    })
  );

  if (!result.Items?.length) {
    throw new AppError('Session expired. Please login again', 401);
  }

  const payload = {
    userId: decoded.userId,
    role: decoded.role,
    userType: decoded.userType,
  };

  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  };
};

exports.logoutService = async (refreshToken) => {
  if (!refreshToken) return;

  const result = await client.send(
    new QueryCommand({
      TableName: TABLES.SESSIONS,
      IndexName: 'refreshToken-index',
      KeyConditionExpression: 'refreshToken = :rt',
      ExpressionAttributeValues: { ':rt': { S: refreshToken } },
    })
  );

  const session = result.Items?.[0];
  if (!session) return;

  await client.send(
    new DeleteItemCommand({
      TableName: TABLES.SESSIONS,
      Key: { tokenId: session.tokenId },
    })
  );
};
