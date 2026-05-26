/**
 * Creates DynamoDB tables for local development.
 * Safe to re-run: skips tables that already exist.
 */
require('dotenv').config();

const {
  DynamoDBClient,
  CreateTableCommand,
  DescribeTableCommand,
} = require('@aws-sdk/client-dynamodb');
const TABLES = require('../src/database/tables');

const client = new DynamoDBClient({
  region: process.env.DYNAMODB_REGION || 'local',
  endpoint: process.env.DYNAMODB_ENDPOINT || 'http://localhost:8000',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'local',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'local',
  },
});

const tableDefinitions = [
  {
    TableName: TABLES.ADMINS,
    AttributeDefinitions: [
      { AttributeName: 'adminId', AttributeType: 'S' },
      { AttributeName: 'email', AttributeType: 'S' },
    ],
    KeySchema: [{ AttributeName: 'adminId', KeyType: 'HASH' }],
    GlobalSecondaryIndexes: [
      {
        IndexName: 'email-index',
        KeySchema: [{ AttributeName: 'email', KeyType: 'HASH' }],
        Projection: { ProjectionType: 'ALL' },
      },
    ],
  },
  {
    TableName: TABLES.SESSIONS,
    AttributeDefinitions: [
      { AttributeName: 'tokenId', AttributeType: 'S' },
      { AttributeName: 'refreshToken', AttributeType: 'S' },
    ],
    KeySchema: [{ AttributeName: 'tokenId', KeyType: 'HASH' }],
    GlobalSecondaryIndexes: [
      {
        IndexName: 'refreshToken-index',
        KeySchema: [{ AttributeName: 'refreshToken', KeyType: 'HASH' }],
        Projection: { ProjectionType: 'ALL' },
      },
    ],
  },
  {
    TableName: TABLES.USERS,
    AttributeDefinitions: [
      { AttributeName: 'userId', AttributeType: 'S' },
      { AttributeName: 'phone', AttributeType: 'S' },
    ],
    KeySchema: [{ AttributeName: 'userId', KeyType: 'HASH' }],
    GlobalSecondaryIndexes: [
      {
        IndexName: 'phone-index',
        KeySchema: [{ AttributeName: 'phone', KeyType: 'HASH' }],
        Projection: { ProjectionType: 'ALL' },
      },
    ],
  },
  {
    TableName: TABLES.OTPS,
    AttributeDefinitions: [{ AttributeName: 'phone', AttributeType: 'S' }],
    KeySchema: [{ AttributeName: 'phone', KeyType: 'HASH' }],
  },
  {
    TableName: TABLES.SERVICE_CATEGORIES,
    AttributeDefinitions: [
      { AttributeName: 'id', AttributeType: 'S' },
      { AttributeName: 'slug', AttributeType: 'S' },
    ],
    KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
    GlobalSecondaryIndexes: [
      {
        IndexName: 'slug-index',
        KeySchema: [{ AttributeName: 'slug', KeyType: 'HASH' }],
        Projection: { ProjectionType: 'ALL' },
      },
    ],
  },
  {
    TableName: TABLES.SERVICES,
    AttributeDefinitions: [
      { AttributeName: 'id', AttributeType: 'S' },
      { AttributeName: 'categoryId', AttributeType: 'S' },
    ],
    KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
    GlobalSecondaryIndexes: [
      {
        IndexName: 'categoryId-index',
        KeySchema: [{ AttributeName: 'categoryId', KeyType: 'HASH' }],
        Projection: { ProjectionType: 'ALL' },
      },
    ],
  },
  {
    TableName: TABLES.BOOKINGS,
    AttributeDefinitions: [
      { AttributeName: 'id', AttributeType: 'S' },
      { AttributeName: 'userId', AttributeType: 'S' },
      { AttributeName: 'bookingDate', AttributeType: 'S' },
    ],
    KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
    GlobalSecondaryIndexes: [
      {
        IndexName: 'userId-index',
        KeySchema: [{ AttributeName: 'userId', KeyType: 'HASH' }],
        Projection: { ProjectionType: 'ALL' },
      },
      {
        IndexName: 'bookingDate-index',
        KeySchema: [{ AttributeName: 'bookingDate', KeyType: 'HASH' }],
        Projection: { ProjectionType: 'ALL' },
      },
    ],
  },
  {
    TableName: TABLES.PLATFORM_SETTINGS,
    AttributeDefinitions: [{ AttributeName: 'settingKey', AttributeType: 'S' }],
    KeySchema: [{ AttributeName: 'settingKey', KeyType: 'HASH' }],
  },
  {
    TableName: TABLES.NOTIFICATIONS,
    AttributeDefinitions: [{ AttributeName: 'id', AttributeType: 'S' }],
    KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
  },
  {
    TableName: TABLES.PRODUCT_CATEGORIES,
    AttributeDefinitions: [
      { AttributeName: 'id', AttributeType: 'S' },
      { AttributeName: 'slug', AttributeType: 'S' },
    ],
    KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
    GlobalSecondaryIndexes: [
      {
        IndexName: 'slug-index',
        KeySchema: [{ AttributeName: 'slug', KeyType: 'HASH' }],
        Projection: { ProjectionType: 'ALL' },
      },
    ],
  },
  {
    TableName: TABLES.PRODUCTS,
    AttributeDefinitions: [
      { AttributeName: 'id', AttributeType: 'S' },
      { AttributeName: 'categoryId', AttributeType: 'S' },
    ],
    KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
    GlobalSecondaryIndexes: [
      {
        IndexName: 'categoryId-index',
        KeySchema: [{ AttributeName: 'categoryId', KeyType: 'HASH' }],
        Projection: { ProjectionType: 'ALL' },
      },
    ],
  },
  {
    TableName: TABLES.CONTENT_ITEMS,
    AttributeDefinitions: [
      { AttributeName: 'collection', AttributeType: 'S' },
      { AttributeName: 'id', AttributeType: 'S' },
    ],
    KeySchema: [
      { AttributeName: 'collection', KeyType: 'HASH' },
      { AttributeName: 'id', KeyType: 'RANGE' },
    ],
  },
];

async function tableExists(name) {
  try {
    await client.send(new DescribeTableCommand({ TableName: name }));
    return true;
  } catch (err) {
    if (err.name === 'ResourceNotFoundException') return false;
    throw err;
  }
}

async function createTable(def) {
  const exists = await tableExists(def.TableName);
  if (exists) {
    console.log(`  skip  ${def.TableName} (already exists)`);
    return;
  }

  await client.send(
    new CreateTableCommand({
      ...def,
      BillingMode: 'PAY_PER_REQUEST',
    })
  );
  console.log(`  created ${def.TableName}`);
}

async function main() {
  console.log('Setting up DynamoDB tables...');
  console.log(`  endpoint: ${process.env.DYNAMODB_ENDPOINT || 'http://localhost:8000'}`);

  for (const def of tableDefinitions) {
    await createTable(def);
  }

  console.log('Done.');
}

main().catch((err) => {
  console.error('Database setup failed:', err.message);
  process.exit(1);
});
