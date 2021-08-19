import {
  GetItemCommand,
  GetItemCommandInput,
  PutItemCommand,
  PutItemCommandInput,
} from "@aws-sdk/client-dynamodb";
import dynamoClient from ".";
import { tableNameByStage } from "../config";
import logger from "../helpers/logger";

const tableName = tableNameByStage("memo");

export const putMemoItem = async (
  guild: string,
  user: string,
  content: string
): Promise<void> => {
  try {
    logger.log("Memo: putMemoItem", { guild, user, content });
    const input: PutItemCommandInput = {
      TableName: tableName,
      Item: {
        guild: { S: guild },
        user: { S: user },
        content: { S: content },
      },
    };
    const command = new PutItemCommand(input);
    await dynamoClient.send(command);
  } catch (err) {
    logger.error("Memo: putMemoItem Error", err);
  }
};

export const getMemoItem = async (
  guild: string,
  user: string
): Promise<string | null> => {
  try {
    const input: GetItemCommandInput = {
      TableName: tableName,
      Key: { guild: { S: guild }, user: { S: user } },
    };
    const command = new GetItemCommand(input);
    const output = await dynamoClient.send(command);
    const memo = output.Item?.content.S;
    logger.log("Memo: getMemoItem", { guild, user, memo });
    if (!memo) return null;
    return memo;
  } catch (err) {
    logger.error("Memo: getMemoItem Error", err);
    return null;
  }
};
