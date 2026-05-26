const {
  QueryCommand,
  GetCommand,
  PutCommand,
  DeleteCommand,
} = require('@aws-sdk/lib-dynamodb');
const docClient = require('../../config/dynamoDoc');
const TABLES = require('../../database/tables');
const { sanitizeItem } = require('../../utils/sanitizeItem');

async function list(collection, { activeOnly = false } = {}) {
  const result = await docClient.send(
    new QueryCommand({
      TableName: TABLES.CONTENT_ITEMS,
      KeyConditionExpression: '#col = :c',
      ExpressionAttributeNames: { '#col': 'collection' },
      ExpressionAttributeValues: { ':c': collection },
    })
  );
  let items = result.Items || [];
  items.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  if (activeOnly) items = items.filter((x) => x.isActive !== false);
  return items;
}

async function upsert(collection, item) {
  const now = new Date().toISOString();
  const record = sanitizeItem({
    collection,
    ...item,
    sortOrder: Number(item.sortOrder) || 0,
    isActive: item.isActive !== false,
    updatedAt: now,
    createdAt: item.createdAt || now,
  });
  await docClient.send(new PutCommand({ TableName: TABLES.CONTENT_ITEMS, Item: record }));
  return record;
}

async function remove(collection, id) {
  await docClient.send(
    new DeleteCommand({
      TableName: TABLES.CONTENT_ITEMS,
      Key: { collection, id },
    })
  );
}

module.exports = { list, upsert, remove };
