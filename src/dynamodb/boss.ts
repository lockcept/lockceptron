import {
  AttributeValue,
  GetItemCommand,
  GetItemCommandInput,
  PutItemCommand,
  PutItemCommandInput,
  ScanCommand,
  ScanCommandInput,
} from "@aws-sdk/client-dynamodb";
import { compact } from "lodash";
import dynamoClient from ".";
import { tableNameByStage } from "../config";
import logger from "../helpers/logger";

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
    ? parseInt(item.commission?.N, 10)
    : undefined;

  if (!guild || !itemId || !itemName || !from || !to) return null;
  return { guild, itemId, itemName, from, to, pay, price, commission };
};

export const addItem = async (
  guild: string,
  itemId: string,
  itemName: string,
  from: string,
  to: string[]
): Promise<void> => {
  try {
    logger.log("Boss: addItem", { guild, itemId, itemName, from, to });
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
    logger.error("Boss: addItem Error", err);
  }
};
export const getAllBossItems = async (guild: string): Promise<BossItem[]> => {
  try {
    const input: ScanCommandInput = {
      TableName: tableName,
      FilterExpression: "#g = :g",
      ExpressionAttributeNames: { "#g": "guild" },
      ExpressionAttributeValues: { ":g": { S: guild } },
    };
    const command = new ScanCommand(input);
    const output = await dynamoClient.send(command);
    if (!output.Items) return [];
    const bossItems = compact(
      output.Items.map((item) => getBossItemFromItem(item))
    );
    logger.log("Boss: getItems", { guild });
    return bossItems;
  } catch (err) {
    logger.error("Boss: getAllBossItems Error", err);
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
