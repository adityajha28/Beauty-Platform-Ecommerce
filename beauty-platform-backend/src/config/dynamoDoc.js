const { DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb');
const rawClient = require('./dynamoClient');

const docClient = DynamoDBDocumentClient.from(rawClient, {
  marshallOptions: { removeUndefinedValues: true },
});

module.exports = docClient;
