import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { credentials } from '../config';

const dynamoClient = new DynamoDBClient({
  credentials: {
    accessKeyId: credentials.accessKeyId,
    secretAccessKey: credentials.secretAccessKey,
  },
  region: 'ap-northeast-2',
});

export default dynamoClient;
