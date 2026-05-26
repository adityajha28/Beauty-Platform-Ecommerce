const { ScanCommand, GetCommand } = require('@aws-sdk/lib-dynamodb');
const docClient = require('../../config/dynamoDoc');
const TABLES = require('../../database/tables');

async function listAll() {
  const items = [];
  let ExclusiveStartKey;

  do {
    const result = await docClient.send(
      new ScanCommand({
        TableName: TABLES.USERS,
        ExclusiveStartKey,
      })
    );
    items.push(...(result.Items || []));
    ExclusiveStartKey = result.LastEvaluatedKey;
  } while (ExclusiveStartKey);

  return items;
}

async function getById(userId) {
  const result = await docClient.send(
    new GetCommand({
      TableName: TABLES.USERS,
      Key: { userId },
    })
  );
  return result.Item || null;
}

module.exports = { listAll, getById };
