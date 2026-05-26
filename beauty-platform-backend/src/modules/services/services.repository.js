const { ScanCommand, GetCommand, PutCommand, DeleteCommand, QueryCommand } = require('@aws-sdk/lib-dynamodb');
const docClient = require('../../config/dynamoDoc');
const TABLES = require('../../database/tables');
const { toSlug } = require('../../utils/slug');

async function listCategories({ activeOnly = false } = {}) {
  const result = await docClient.send(
    new ScanCommand({ TableName: TABLES.SERVICE_CATEGORIES })
  );
  let items = result.Items || [];
  items.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  if (activeOnly) items = items.filter((c) => c.isActive !== false);
  return items;
}

async function getCategoryById(id) {
  const result = await docClient.send(
    new GetCommand({ TableName: TABLES.SERVICE_CATEGORIES, Key: { id } })
  );
  return result.Item || null;
}

async function findCategoryBySlugOrName(value) {
  const needle = toSlug(value);
  const categories = await listCategories();
  return (
    categories.find((c) => toSlug(c.slug) === needle || toSlug(c.name) === needle) ||
    categories.find((c) => c.name?.toLowerCase() === String(value).toLowerCase()) ||
    null
  );
}

async function upsertCategory(item) {
  const now = new Date().toISOString();
  const record = {
    ...item,
    slug: item.slug || toSlug(item.name),
    sortOrder: Number(item.sortOrder) || 0,
    isActive: item.isActive !== false,
    updatedAt: now,
    createdAt: item.createdAt || now,
  };
  await docClient.send(
    new PutCommand({ TableName: TABLES.SERVICE_CATEGORIES, Item: record })
  );
  return record;
}

async function deleteCategory(id) {
  await docClient.send(
    new DeleteCommand({ TableName: TABLES.SERVICE_CATEGORIES, Key: { id } })
  );
}

async function listServices({ activeOnly = false, categoryId = null } = {}) {
  if (categoryId) {
    const result = await docClient.send(
      new QueryCommand({
        TableName: TABLES.SERVICES,
        IndexName: 'categoryId-index',
        KeyConditionExpression: 'categoryId = :cid',
        ExpressionAttributeValues: { ':cid': categoryId },
      })
    );
    let items = result.Items || [];
    if (activeOnly) items = items.filter((s) => s.isActive !== false);
    return items;
  }

  const result = await docClient.send(new ScanCommand({ TableName: TABLES.SERVICES }));
  let items = result.Items || [];
  if (activeOnly) items = items.filter((s) => s.isActive !== false);
  return items;
}

async function getServiceById(id) {
  const result = await docClient.send(
    new GetCommand({ TableName: TABLES.SERVICES, Key: { id } })
  );
  return result.Item || null;
}

async function upsertService(item) {
  const now = new Date().toISOString();
  const record = {
    ...item,
    price: Number(item.price) || 0,
    duration: Number(item.duration) || 0,
    isActive: item.isActive !== false,
    isPopular: !!item.isPopular,
    updatedAt: now,
    createdAt: item.createdAt || now,
  };
  await docClient.send(new PutCommand({ TableName: TABLES.SERVICES, Item: record }));
  return record;
}

async function deleteService(id) {
  await docClient.send(new DeleteCommand({ TableName: TABLES.SERVICES, Key: { id } }));
}

async function getOperations() {
  const result = await docClient.send(
    new GetCommand({
      TableName: TABLES.PLATFORM_SETTINGS,
      Key: { settingKey: 'operations' },
    })
  );
  return result.Item?.value || null;
}

async function setOperations(value) {
  const record = {
    settingKey: 'operations',
    value: {
      servicesOpen: value.servicesOpen !== false,
      productsOpen: value.productsOpen !== false,
      serviceMessage:
        value.serviceMessage ||
        'Service bookings are temporarily paused. Please check back soon.',
      productMessage:
        value.productMessage ||
        'Product orders are temporarily paused. Please check back soon.',
      globalBanner: value.globalBanner || '',
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
  listCategories,
  getCategoryById,
  findCategoryBySlugOrName,
  upsertCategory,
  deleteCategory,
  listServices,
  getServiceById,
  upsertService,
  deleteService,
  getOperations,
  setOperations,
};
