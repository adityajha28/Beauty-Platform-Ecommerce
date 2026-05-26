const {
  PutCommand,
  GetCommand,
  QueryCommand,
  ScanCommand,
  UpdateCommand,
} = require('@aws-sdk/lib-dynamodb');
const { sanitizeSlotList } = require('../../utils/bookingSlotUtils');
const docClient = require('../../config/dynamoDoc');
const TABLES = require('../../database/tables');
const { sanitizeItem } = require('../../utils/sanitizeItem');

async function create(booking) {
  const item = sanitizeItem(booking);
  await docClient.send(new PutCommand({ TableName: TABLES.BOOKINGS, Item: item }));
  return item;
}

async function getById(id) {
  const result = await docClient.send(
    new GetCommand({ TableName: TABLES.BOOKINGS, Key: { id } })
  );
  return result.Item || null;
}

async function listByUserId(userId) {
  const result = await docClient.send(
    new QueryCommand({
      TableName: TABLES.BOOKINGS,
      IndexName: 'userId-index',
      KeyConditionExpression: 'userId = :uid',
      ExpressionAttributeValues: { ':uid': userId },
    })
  );
  return (result.Items || []).sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
}

async function listByDate(bookingDate) {
  const result = await docClient.send(
    new QueryCommand({
      TableName: TABLES.BOOKINGS,
      IndexName: 'bookingDate-index',
      KeyConditionExpression: 'bookingDate = :d',
      ExpressionAttributeValues: { ':d': bookingDate },
    })
  );
  return result.Items || [];
}

async function listAll() {
  const result = await docClient.send(new ScanCommand({ TableName: TABLES.BOOKINGS }));
  return (result.Items || []).sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
}

async function updateStatus(id, status, extra = {}) {
  const expressions = ['#st = :status', 'updatedAt = :u'];
  const names = { '#st': 'status' };
  const values = { ':status': status, ':u': new Date().toISOString() };

  Object.entries(extra).forEach(([key, val], i) => {
    const attr = `#k${i}`;
    const valKey = `:v${i}`;
    expressions.push(`${attr} = ${valKey}`);
    names[attr] = key;
    values[valKey] = val;
  });

  const result = await docClient.send(
    new UpdateCommand({
      TableName: TABLES.BOOKINGS,
      Key: { id },
      UpdateExpression: `SET ${expressions.join(', ')}`,
      ExpressionAttributeNames: names,
      ExpressionAttributeValues: values,
      ReturnValues: 'ALL_NEW',
    })
  );
  return result.Attributes;
}

async function createNotification(notification) {
  const item = sanitizeItem(notification);
  await docClient.send(
    new PutCommand({ TableName: TABLES.NOTIFICATIONS, Item: item })
  );
  return item;
}

async function getBookingSlotSettings() {
  const result = await docClient.send(
    new GetCommand({
      TableName: TABLES.PLATFORM_SETTINGS,
      Key: { settingKey: 'bookingSlots' },
    })
  );
  return result.Item?.value || null;
}

async function setBookingSlotSettings(slots) {
  const cleaned = sanitizeSlotList(slots);
  const record = {
    settingKey: 'bookingSlots',
    value: {
      slots: cleaned,
      updatedAt: new Date().toISOString(),
    },
    updatedAt: new Date().toISOString(),
  };
  await docClient.send(
    new PutCommand({ TableName: TABLES.PLATFORM_SETTINGS, Item: record })
  );
  return record.value;
}

module.exports = {
  create,
  getById,
  listByUserId,
  listByDate,
  listAll,
  updateStatus,
  createNotification,
  getBookingSlotSettings,
  setBookingSlotSettings,
};
