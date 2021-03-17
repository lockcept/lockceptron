import {
  DynamoDBClient, GetItemCommand, GetItemCommandInput, PutItemCommand, PutItemCommandInput,
} from '@aws-sdk/client-dynamodb';
import { credentials, tableName } from '../config';

const dynamoClient = new DynamoDBClient({
  credentials: {
    accessKeyId: credentials.accessKeyId,
    secretAccessKey: credentials.secretAccessKey,
  },
  region: 'ap-northeast-2',
});

// eslint-disable-next-line import/prefer-default-export
export const a = async (id:string, content:string) => {
  try {
    console.log(id, content);
    const input: PutItemCommandInput = {
      TableName: tableName,
      Item: {
        id: { S: id },
        content: { S: content },
      },
    };
    const command = new PutItemCommand(input);
    await dynamoClient.send(command);
  } catch (err) {
    console.error('asdf', err);
  }
};

// eslint-disable-next-line consistent-return
export const b = async (id:string):Promise<string | undefined> => {
  try {
    const input: GetItemCommandInput = { TableName: tableName, Key: { id: { S: id } } };
    const command = new GetItemCommand(input);
    const output = await dynamoClient.send(command);
    console.log(output.Item?.content.S);
    return output.Item?.content.S;
  } catch (err) {
    console.error('asdf', err);
  }
};
