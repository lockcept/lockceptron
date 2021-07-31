import {
  GetItemCommand,
  GetItemCommandInput,
  PutItemCommand,
  PutItemCommandInput,
} from "@aws-sdk/client-dynamodb";
import dynamoClient from ".";
import { tableNameByStage } from "../config";
import logger from "../helpers/logger";

const tableName = tableNameByStage("boss");

export const addItem = async (
  guild: string,
  item: string,
  itemName: string,
  from: string,
  to: string[]
): Promise<void> => {
  try {
    logger.log("Boss: addItem", { guild, item, itemName, from, to });
    const input: PutItemCommandInput = {
      TableName: tableName,
      Item: {
        guild: { S: guild },
        item: { S: item },
        itemName: { S: itemName },
        from: { S: from },
        to: { SS: to },
      },
    };
    const command = new PutItemCommand(input);
    await dynamoClient.send(command);
  } catch (err) {
    logger.error("Boss: addItem Error", err);
  }
};

export const loadMemo = async (
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
    logger.log("Memo: loadMemo", { guild, user, memo });
    if (!memo) return null;
    return memo;
  } catch (err) {
    logger.error("Memo: loadMemo Error", err);
    return null;
  }
};
