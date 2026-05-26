const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const env = require('./env');

const client = new DynamoDBClient({
  region: env.dynamoRegion,
  endpoint: env.dynamoEndpoint,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'local',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'local',
  },
});

module.exports = client;
