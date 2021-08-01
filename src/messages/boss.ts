import { MessageEmbed } from "discord.js";
import { chain, filter } from "lodash";
import { customAlphabet } from "nanoid";
import { nolookalikes } from "nanoid-dictionary";
import {
  getAllBossItems,
  getBossItem,
  addBossItem,
  BossItem,
  updateBossItem,
  deleteBossItem,
} from "../dynamodb/boss";

import { MessageListener } from "../helpers/addMessageListener";
import logger from "../helpers/logger";

const boss: MessageListener = async (msg, message) => {
  const getUserId = (cmd: string): string | null => {
    const result = cmd.match(/^<@!([0-9]+)>$/i);
    if (!result) return null;
    return result[1];
  };

  const getDividend = (bossItem: BossItem): number => {
    const peopleCnt = bossItem.to.length + 1;
    const { price = 0, commission = 1 } = bossItem;
    return Math.round((price * commission) / peopleCnt);
  };

  const { guild } = msg;
  if (!guild) throw Error("guild not found");

  const add = (cmd: string): void => {
    const [item, ...users] = cmd.split(" ");
    if (getUserId(item)) {
      return;
    }

    const userIds = chain(users)
      .map((user) => {
        return getUserId(user);
      })
      .compact()
      .value();
    if (userIds.length === 0) return;

    const itemId = customAlphabet(nolookalikes, 6)();
    const itemName = item.substring(0, 20);
    const fromUser = msg.author.id;
    addBossItem(guild.id, itemId, itemName, fromUser, userIds);
    msg.channel.send(`[${itemId}]: ${itemName} 등록 완료!`);
  };

  const remove = async (cmd: string): Promise<void> => {
    const itemId = cmd;
    const bossItem = await getBossItem(guild.id, itemId);
    if (!bossItem) {
      msg.channel.send("해당하는 아이템이 없습니다.");
      return;
    }
    if (bossItem.from !== msg.author.id) {
      msg.channel.send(`[${itemId}]: 권한이 없습니다.`);
      return;
    }

    const success = await deleteBossItem(guild.id, itemId);
    if (success) msg.channel.send(`[${itemId}]: 삭제 완료`);
  };

  const updatePrice = async (cmd: string): Promise<void> => {
    const words = cmd.split(" ");
    if (words.length < 2) return;
    const itemId = words[0];
    const price = parseInt(words[1], 10);
    const commission = words?.[2] ? parseFloat(words?.[2]) : undefined;
    const bossItem = await updateBossItem(
      guild.id,
      itemId,
      {
        price,
        commission,
      },
      {}
    );
    if (bossItem)
      msg.channel.send(
        `[${itemId}]: 가격 등록 완료! (인당 ${getDividend(bossItem)})`
      );
  };

  const pay = async (cmd: string): Promise<void> => {
    const [itemId, ...users] = cmd.split(" ");
    if (getUserId(itemId)) {
      return;
    }

    const userIds = chain(users)
      .map((user) => {
        return getUserId(user);
      })
      .compact()
      .value();
    if (userIds.length === 0) return;

    const prevItem = await getBossItem(guild.id, itemId);
    if (!prevItem) return;

    if (prevItem.from !== msg.author.id) {
      msg.channel.send(`[${itemId}]: 권한이 없습니다.`);
      return;
    }
    const existUserIds = userIds.filter((userId) =>
      prevItem.to.includes(userId)
    );

    const bossItem = await updateBossItem(
      guild.id,
      itemId,
      {},
      { pay: existUserIds }
    );
    if (bossItem)
      msg.channel.send(`[${itemId}]: ${existUserIds.length}명 상환 완료!`);
  };

  const list = async (cmd: string): Promise<void> => {
    if (cmd === "me") {
      const bossItems = await getAllBossItems(guild.id);
      const myUserId = msg.author.id;
      const myBossItems = filter(
        bossItems,
        (item) =>
          item.from === myUserId ||
          (item.to.includes(myUserId) && !item.pay.includes(myUserId))
      );
      const description = myBossItems
        .map((item) => {
          return `${item.itemId}${
            item.price ? ` (${getDividend(item)})` : ""
          } : ${item.itemName} <@!${item.from}>`;
        })
        .join("\n");
      msg.channel.send(
        new MessageEmbed({
          title: `${msg.member?.displayName} Items`,
          description,
        })
      );
      return;
    }

    if (cmd === "all") {
      const bossItems = await getAllBossItems(guild.id);
      const description = bossItems
        .map((item) => {
          return `${item.itemId}: ${item.itemName} <@!${item.from}>`;
        })
        .join("\n");
      msg.channel.send(
        new MessageEmbed({
          title: `All Items`,
          description,
        })
      );
      return;
    }

    const itemId = cmd;
    const bossItem = await getBossItem(guild.id, itemId);
    if (!bossItem) {
      msg.channel.send("해당하는 아이템이 없습니다.");
      return;
    }

    const description = [
      `From: <@!${bossItem.from}>`,
      `To: ${bossItem.to
        .map((userId) => {
          return `<@!${userId}>`;
        })
        .join(" ")}`,
      `Price: ${bossItem.price ?? "X"}`,
      `Price per people: ${getDividend(bossItem) || "X"}`,
      `Paid: ${
        bossItem.pay.length
          ? bossItem.pay
              .map((userId) => {
                return `<@!${userId}>`;
              })
              .join(" ")
          : "X"
      }`,
    ].join("\n");
    msg.channel.send(
      new MessageEmbed({
        title: `${bossItem.itemName} (${bossItem.itemId})`,
        description,
      })
    );
  };

  if (message.startsWith("boss ")) {
    const cmd = message.substring(5);
    const action = cmd.split(" ")[0];

    switch (action) {
      case "add":
        add(cmd.substring(4));
        break;
      case "remove":
        remove(cmd.substring(7));
        break;
      case "price":
        updatePrice(cmd.substring(6));
        break;
      case "pay":
        pay(cmd.substring(4));
        break;
      case "list":
        await list(cmd.substring(5));
        break;
      default:
        logger.log("Boss: Wrong action", { cmd });
    }
  }
};

export default boss;
