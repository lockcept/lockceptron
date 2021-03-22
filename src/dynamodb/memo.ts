import {
  GetItemCommand, GetItemCommandInput, PutItemCommand, PutItemCommandInput,
} from '@aws-sdk/client-dynamodb';
import dynamoClient from '.';
import { tableNameByStage } from '../config';
import logger from '../helpers/logger';

const tableName = tableNameByStage('memo');

// eslint-disable-next-line import/prefer-default-export
export const saveMemo = async (id:string, content:string) => {
  try {
    logger.log('saveMemo', { id, content });
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
    logger.error('saveMemo Error', err);
  }
};

// eslint-disable-next-line consistent-return
export const loadMemo = async (id:string):Promise<string | undefined> => {
  try {
    const input: GetItemCommandInput = { TableName: tableName, Key: { id: { S: id } } };
    const command = new GetItemCommand(input);
    const output = await dynamoClient.send(command);
    const memo = output.Item?.content.S;
    logger.log('loadMemo', { id, memo });
    return memo;
  } catch (err) {
    logger.error('loadMemo Error', err);
  }
};
