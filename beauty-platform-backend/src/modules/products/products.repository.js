const {
  ScanCommand,
  GetCommand,
  PutCommand,
  DeleteCommand,
  QueryCommand,
} = require('@aws-sdk/lib-dynamodb');
const docClient = require('../../config/dynamoDoc');
const TABLES = require('../../database/tables');
const { toSlug } = require('../../utils/slug');
const { sanitizeItem } = require('../../utils/sanitizeItem');

async function listCategories({ activeOnly = false } = {}) {
  const result = await docClient.send(new ScanCommand({ TableName: TABLES.PRODUCT_CATEGORIES }));
  let items = result.Items || [];
  items.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  if (activeOnly) items = items.filter((c) => c.isActive !== false);
  return items;
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
  const record = sanitizeItem({
    ...item,
    slug: item.slug || toSlug(item.name),
    sortOrder: Number(item.sortOrder) || 0,
    isActive: item.isActive !== false,
    updatedAt: now,
    createdAt: item.createdAt || now,
  });
  await docClient.send(new PutCommand({ TableName: TABLES.PRODUCT_CATEGORIES, Item: record }));
  return record;
}

async function deleteCategory(id) {
  await docClient.send(new DeleteCommand({ TableName: TABLES.PRODUCT_CATEGORIES, Key: { id } }));
}

async function listProducts({ activeOnly = false, categoryId = null } = {}) {
  if (categoryId) {
    const result = await docClient.send(
      new QueryCommand({
        TableName: TABLES.PRODUCTS,
        IndexName: 'categoryId-index',
        KeyConditionExpression: 'categoryId = :cid',
        ExpressionAttributeValues: { ':cid': categoryId },
      })
    );
    let items = result.Items || [];
    if (activeOnly) items = items.filter((p) => p.isActive !== false);
    return items;
  }
  const result = await docClient.send(new ScanCommand({ TableName: TABLES.PRODUCTS }));
  let items = result.Items || [];
  if (activeOnly) items = items.filter((p) => p.isActive !== false);
  return items;
}

async function getProductById(id) {
  const result = await docClient.send(
    new GetCommand({ TableName: TABLES.PRODUCTS, Key: { id } })
  );
  return result.Item || null;
}

async function upsertProduct(item) {
  const now = new Date().toISOString();
  const record = sanitizeItem({
    ...item,
    price: Number(item.price) || 0,
    stock: Number(item.stock) ?? 0,
    isActive: item.isActive !== false,
    updatedAt: now,
    createdAt: item.createdAt || now,
  });
  await docClient.send(new PutCommand({ TableName: TABLES.PRODUCTS, Item: record }));
  return record;
}

async function deleteProduct(id) {
  await docClient.send(new DeleteCommand({ TableName: TABLES.PRODUCTS, Key: { id } }));
}

module.exports = {
  listCategories,
  findCategoryBySlugOrName,
  upsertCategory,
  deleteCategory,
  listProducts,
  getProductById,
  upsertProduct,
  deleteProduct,
};
