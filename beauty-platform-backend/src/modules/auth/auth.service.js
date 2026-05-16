const { QueryCommand, PutItemCommand } = require("@aws-sdk/client-dynamodb");
const { ScanCommand, DeleteItemCommand } = require("@aws-sdk/client-dynamodb");
const client = require("../../config/dynamoClient");
const { comparePassword } = require("../../utils/hash");
const { generateAccessToken, generateRefreshToken } = require("../../utils/jwt");
const { v4: uuidv4 } = require("uuid");
const AppError = require('../../utils/appError');
const jwt = require('jsonwebtoken');

// if (!user) {
//   throw new AppError("Invalid email or password", 401);
// }

exports.adminLoginService = async (email, password) => {

  // 1. Fetch user using GSI
  const command = new QueryCommand({
    TableName: "Admins",   // ✅ CHANGED
    IndexName: "email-index",
    KeyConditionExpression: "email = :email",
    ExpressionAttributeValues: {
      ":email": { S: email },
    },
  });

  const result = await client.send(command);

  if (!result.Items || result.Items.length === 0) {
    throw new Error("Invalid email or password");
  }

  const user = result.Items[0];

  const admin = result.Items[0];

  // 2. Check role
  if (user.role.S !== "admin") {
    throw new Error("Unauthorized access");
  }

  // 3. Compare password
  const isMatch = await comparePassword(password, user.password.S);

  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  // 4. Prepare payload
  const payload = {
    userId: admin.adminId.S,
    role: admin.role.S,
    userType: "admin",   
  };

  // 5. Generate tokens
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  // 6. Store refresh token (optional but recommended)
  await client.send(new PutItemCommand({
    TableName: "Sessions",
    Item: {
      tokenId: { S: uuidv4() },
      refreshToken: { S: refreshToken },
      userId: { S: payload.userId },
      userType: { S: "admin" }  
    },
  }));

  return {
    accessToken,
    refreshToken,
    user: {
      userId: payload.userId,
      role: payload.role,
      email: email,
    },
  };
};



exports.refreshTokenService = async (refreshToken) => {

  // 1. Verify refresh token
  let decoded;

  try {
    decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  } catch (err) {
    throw new Error("Invalid or expired refresh token");
  }

  // 2. Check if token exists in DB (IMPORTANT)
  const command = new QueryCommand({
    TableName: "Sessions",
    IndexName: "refreshToken-index", // optional GSI
    KeyConditionExpression: "refreshToken = :rt",
    ExpressionAttributeValues: {
      ":rt": { S: refreshToken },
    },
  });

  const result = await client.send(command);

  if (!result.Items || result.Items.length === 0) {
    throw new Error("Session expired. Please login again");
  }

  // 3. Generate new tokens
  const payload = {
    userId: decoded.userId,
    role: decoded.role,
    userType: decoded.userType,
  };

  const newAccessToken = generateAccessToken(payload);
  const newRefreshToken = generateRefreshToken(payload);

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};


exports.logoutService = async (refreshToken) => {

  if (!refreshToken) return;

  // Find session
  const scan = await client.send(new ScanCommand({
    TableName: "Sessions",
  }));

  const session = scan.Items.find(
    item => item.refreshToken.S === refreshToken
  );

  if (!session) return;

  // Delete session
  await client.send(new DeleteItemCommand({
    TableName: "Sessions",
    Key: {
      tokenId: session.tokenId,
    },
  }));
};