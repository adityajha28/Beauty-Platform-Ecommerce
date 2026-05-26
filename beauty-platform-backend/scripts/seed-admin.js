/**
 * Seeds one admin user. Set ADMIN_SEED_EMAIL and ADMIN_SEED_PASSWORD in .env
 * or pass ADMIN_SEED_PASSWORD when running (never commit real passwords).
 */
require('dotenv').config();

const { DynamoDBClient, PutItemCommand, QueryCommand } = require('@aws-sdk/client-dynamodb');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const TABLES = require('../src/database/tables');

const client = new DynamoDBClient({
  region: process.env.DYNAMODB_REGION || 'local',
  endpoint: process.env.DYNAMODB_ENDPOINT || 'http://localhost:8000',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'local',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'local',
  },
});

async function main() {
  const email = (process.env.ADMIN_SEED_EMAIL || 'admin@orayabeauty.in').trim().toLowerCase();
  const password = process.env.ADMIN_SEED_PASSWORD;

  if (!password) {
    console.error(
      'Set ADMIN_SEED_PASSWORD in .env before running seed (e.g. ADMIN_SEED_PASSWORD=YourSecurePass123)'
    );
    process.exit(1);
  }

  const existing = await client.send(
    new QueryCommand({
      TableName: TABLES.ADMINS,
      IndexName: 'email-index',
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: { ':email': { S: email } },
    })
  );

  if (existing.Items && existing.Items.length > 0) {
    console.log(`Admin already exists for ${email} — skipping seed.`);
    return;
  }

  const hash = await bcrypt.hash(password, 10);
  const adminId = `admin-${uuidv4().slice(0, 8)}`;

  await client.send(
    new PutItemCommand({
      TableName: TABLES.ADMINS,
      Item: {
        adminId: { S: adminId },
        email: { S: email },
        password: { S: hash },
        role: { S: 'admin' },
        createdAt: { S: new Date().toISOString() },
      },
    })
  );

  console.log(`Admin seeded: ${email} (id: ${adminId})`);
}

main().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
