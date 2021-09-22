import {
  AttributeValue,
  DeleteItemCommand,
  DeleteItemCommandInput,
  GetItemCommand,
  GetItemCommandInput,
  PutItemCommand,
  PutItemCommandInput,
  ScanCommandInput,
  UpdateItemCommand,
  UpdateItemCommandInput,
} from "@aws-sdk/client-dynamodb";
import { compact } from "lodash";
import dynamoClient from ".";
import { tableNameByStage } from "../config";
import logger from "../helpers/logger";
import getExpression from "./getExpression";
import scanAll from "./scanAll";

const tableName = tableNameByStage("boss");

export interface BossItem {
  guild: string;
  itemId: string;
  itemName: string;
  from: string;
  to: string[];
  pay: string[];
  price?: number;
  commission?: number;
}

const getBossItemFromItem = (
  item:
    | {
        [key: string]: AttributeValue;
      }
    | undefined
): BossItem | null => {
  if (!item) return null;

  const guild = item.guild?.S;
  const itemId = item.item?.S;
  const itemName = item.itemName?.S;
  const from = item.from?.S;
  const to = item.to?.SS;
  const pay = item.pay?.SS ?? [];
  const price = item.price?.N ? parseInt(item.price?.N, 10) : undefined;
  const commission = item.commission?.N
    ? parseFloat(item.commission?.N)
    : undefined;

  if (!guild || !itemId || !itemName || !from || !to) return null;
  return { guild, itemId, itemName, from, to, pay, price, commission };
};

export const putBossItem = async (
  guild: string,
  itemId: string,
  itemName: string,
  from: string,
  to: string[]
): Promise<void> => {
  try {
    logger.log("Boss: putBossItem", { guild, itemId, itemName, from, to });
    const input: PutItemCommandInput = {
      TableName: tableName,
      Item: {
        guild: { S: guild },
        item: { S: itemId },
        itemName: { S: itemName },
        from: { S: from },
        to: { SS: to },
      },
    };
    const command = new PutItemCommand(input);
    await dynamoClient.send(command);
  } catch (err) {
    logger.error("Boss: putBossItem Error", err);
  }
};

export const scanAllBossItems = async (guild: string): Promise<BossItem[]> => {
  try {
    const input: ScanCommandInput = {
      TableName: tableName,
      FilterExpression: "#g = :g",
      ExpressionAttributeNames: { "#g": "guild" },
      ExpressionAttributeValues: { ":g": { S: guild } },
    };
    const items = await scanAll(input);
    const bossItems = compact(items.map((item) => getBossItemFromItem(item)));
    logger.log("Boss: scanItems", { guild });
    return bossItems;
  } catch (err) {
    logger.error("Boss: scanAllBossItems Error", err);
    return [];
  }
};

export const getBossItem = async (
  guild: string,
  item: string
): Promise<BossItem | null> => {
  try {
    const input: GetItemCommandInput = {
      TableName: tableName,
      Key: { guild: { S: guild }, item: { S: item } },
    };
    const command = new GetItemCommand(input);
    const output = await dynamoClient.send(command);
    const bossItem = getBossItemFromItem(output.Item);
    logger.log("Boss: getItem", { guild, item });
    if (!bossItem) return null;
    return bossItem;
  } catch (err) {
    logger.error("Boss: getBossItem Error", err);
    return null;
  }
};

export const deleteBossItem = async (
  guild: string,
  itemId: string
): Promise<boolean> => {
  try {
    const input: DeleteItemCommandInput = {
      TableName: tableName,
      Key: { guild: { S: guild }, item: { S: itemId } },
    };
    const command = new DeleteItemCommand(input);
    await dynamoClient.send(command);
    logger.log("Boss: deleteBossItem", { guild, itemId });
    return true;
  } catch (err) {
    logger.error("Boss: updateBossItem Error", err);
    return false;
  }
};

export const updateBossItem = async (
  guild: string,
  itemId: string,
  set: Partial<BossItem>,
  add: Partial<BossItem>
): Promise<BossItem | null> => {
  try {
    const { itemName, price, commission } = set;
    const { pay } = add;
    const {
      updateExpression: setExpression,
      expressionAttributeValues: setValues,
    } = getExpression(
      {
        itemName: itemName ? { S: itemName } : null,
        price: price ? { N: price.toString() } : null,
        commission: commission ? { N: commission.toString() } : null,
      },
      "SET",
      "s"
    );
    const {
      updateExpression: addExpression,
      expressionAttributeValues: addValues,
    } = getExpression(
      {
        pay: pay ? { SS: pay } : null,
      },
      "ADD",
      "a"
    );

    const updateExpression = [];
    if (setExpression) updateExpression.push(`SET ${setExpression}`);
    if (addExpression) updateExpression.push(`ADD ${addExpression}`);
    if (!updateExpression.length) return null;

    const input: UpdateItemCommandInput = {
      TableName: tableName,
      Key: { guild: { S: guild }, item: { S: itemId } },
      UpdateExpression: updateExpression.join(" "),
      ExpressionAttributeValues: { ...setValues, ...addValues },
      ReturnValues: "ALL_NEW",
    };
    const command = new UpdateItemCommand(input);
    const output = await dynamoClient.send(command);
    const bossItem = getBossItemFromItem(output.Attributes);
    logger.log("Boss: updateBossItem", { guild, itemId, bossItem });
    if (!bossItem) return null;
    return bossItem;
  } catch (err) {
    logger.error("Boss: updateBossItem Error", err);
    return null;
  }
};
