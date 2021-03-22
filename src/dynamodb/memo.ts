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

interface memoItem {
  guild: string;
  user: string;
}

// eslint-disable-next-line import/prefer-default-export
export const saveMemo = async (
  guild: string,
  user: string,
  content: string
) => {
  try {
    logger.log("saveMemo", { guild, user, content });
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
    logger.error("saveMemo Error", err);
  }
};

// eslint-disable-next-line consistent-return
export const loadMemo = async (
  guild: string,
  user: string
): Promise<string | undefined> => {
  try {
    const input: GetItemCommandInput = {
      TableName: tableName,
      Key: { guild: { S: guild }, user: { S: user } },
    };
    const command = new GetItemCommand(input);
    const output = await dynamoClient.send(command);
    const memo = output.Item?.content.S;
    logger.log("loadMemo", { guild, user, memo });
    return memo;
  } catch (err) {
    logger.error("loadMemo Error", err);
  }
};
