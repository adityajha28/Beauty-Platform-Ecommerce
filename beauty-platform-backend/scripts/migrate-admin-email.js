/**
 * Updates legacy admin email to admin@orayabeauty.in (password unchanged).
 */
require('dotenv').config();

const { DynamoDBClient, ScanCommand, PutItemCommand } = require('@aws-sdk/client-dynamodb');
const TABLES = require('../src/database/tables');

const NEW_EMAIL = (process.env.ADMIN_SEED_EMAIL || 'admin@orayabeauty.in').trim().toLowerCase();
const OLD_EMAILS = ['admin@oraya.com', 'admin@orayabeauty.com', 'admin@orayabeauty.in'].filter(
  (e) => e !== NEW_EMAIL
);

const client = new DynamoDBClient({
  region: process.env.DYNAMODB_REGION || 'local',
  endpoint: process.env.DYNAMODB_ENDPOINT || 'http://localhost:8000',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'local',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'local',
  },
});

async function main() {
  const scan = await client.send(new ScanCommand({ TableName: TABLES.ADMINS }));
  const items = scan.Items || [];

  const already = items.find((a) => a.email?.S?.toLowerCase() === NEW_EMAIL);
  if (already) {
    console.log(`Admin already uses ${NEW_EMAIL} (id: ${already.adminId.S})`);
    return;
  }

  const target = items.find((a) => OLD_EMAILS.includes(a.email?.S?.toLowerCase()));
  if (!target) {
    console.log(`No legacy admin found. Seed with: ADMIN_SEED_EMAIL=${NEW_EMAIL} npm run db:seed`);
    return;
  }

  await client.send(
    new PutItemCommand({
      TableName: TABLES.ADMINS,
      Item: {
        ...target,
        email: { S: NEW_EMAIL },
      },
    })
  );

  console.log(`Updated admin email: ${target.email.S} → ${NEW_EMAIL} (id: ${target.adminId.S})`);
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
