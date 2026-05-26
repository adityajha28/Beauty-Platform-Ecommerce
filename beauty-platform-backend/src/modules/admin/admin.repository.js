const { ScanCommand, QueryCommand, PutCommand, GetCommand } = require('@aws-sdk/lib-dynamodb');
const docClient = require('../../config/dynamoDoc');
const TABLES = require('../../database/tables');

async function findByEmail(email) {
  const result = await docClient.send(
    new QueryCommand({
      TableName: TABLES.ADMINS,
      IndexName: 'email-index',
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: { ':email': email.trim().toLowerCase() },
    })
  );
  return result.Items?.[0] || null;
}

async function listAdmins() {
  const result = await docClient.send(new ScanCommand({ TableName: TABLES.ADMINS }));
  const items = result.Items || [];
  return items
    .filter((a) => a.role === 'admin')
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
}

async function createAdmin(record) {
  await docClient.send(new PutCommand({ TableName: TABLES.ADMINS, Item: record }));
  return record;
}

async function getById(adminId) {
  const result = await docClient.send(
    new GetCommand({ TableName: TABLES.ADMINS, Key: { adminId } })
  );
  return result.Item || null;
}

module.exports = { findByEmail, listAdmins, createAdmin, getById };
