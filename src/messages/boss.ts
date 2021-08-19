import { MessageEmbed } from "discord.js";
import { chain, compact, filter, forEach, map, partition, round } from "lodash";
import { customAlphabet } from "nanoid";
import { nolookalikes } from "nanoid-dictionary";
import { helpDoc } from "../config";
import {
  getAllBossItems,
  getBossItem,
  addBossItem,
  BossItem,
  updateBossItem,
  deleteBossItem,
} from "../dynamodb/boss";

import { MessageListener } from "../helpers/addMessageListener";
import escapeDiscord from "../helpers/escape";
import logger from "../helpers/logger";

const ROUND_PRECISION = 1;

const boss: MessageListener = async (msg, message) => {
  const getUserId = (cmd: string): string | null => {
    const result = cmd.match(/^<@!([0-9]+)>$/i);
    if (!result) return null;
    return result[1];
  };

  const getDividend = (bossItem: BossItem): number => {
    const peopleCnt = bossItem.to.length + 1;
    const { price = 0, commission = 1 } = bossItem;
    return round((price * commission) / peopleCnt, ROUND_PRECISION);
  };

  const { guild } = msg;
  if (!guild) throw Error("guild not found");

  /* command list */
  const help = (): void => {
    msg.channel.send(
      new MessageEmbed({
        title: "tron boss 커맨드",
        description: [
          "tron boss add",
          "tron boss price",
          "tron boss list",
          "tron boss pay",
          "tron boss remove",
          `자세한 사항은 [Command DOCS](${helpDoc})`,
        ].join("\n"),
      })
    );
  };

  const add = async (cmd: string): Promise<void> => {
    const [item, ...users] = cmd.split(" ");
    if (getUserId(item)) {
      return;
    }

    const fromUser = msg.author.id;

    const userIds = chain(users)
      .map((user) => {
        return getUserId(user);
      })
      .compact()
      .filter((userId) => userId !== fromUser)
      .value();
    if (userIds.length === 0) return;

    const itemId = customAlphabet(nolookalikes, 6)();
    const itemName = item.substring(0, 20);
    await addBossItem(guild.id, itemId, itemName, fromUser, userIds);
    msg.channel.send(escapeDiscord(`[${itemId}]: ${itemName} 등록 완료!`));
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
        escapeDiscord(
          `[${itemId}]: ${
            bossItem.itemName
          } 가격 등록 완료! (인당 ${getDividend(bossItem)})`
        )
      );
  };

  const payAll = async (from: string, to: string): Promise<BossItem[]> => {
    const allBossItems = await getAllBossItems(guild.id);
    const validBossItems = allBossItems.filter(
      (bossItem) =>
        !!bossItem.price &&
        bossItem.from === from &&
        bossItem.to.includes(to) &&
        !bossItem.pay.includes(to)
    );
    const payTasks = validBossItems.map((item) => {
      return updateBossItem(guild.id, item.itemId, {}, { pay: [to] });
    });
    const paidItems = await Promise.all(payTasks);
    return compact(paidItems);
  };

  const pay = async (cmd: string): Promise<void> => {
    const [itemId, ...users] = cmd.split(" ");
    const checkIfUser = getUserId(itemId);
    if (checkIfUser) {
      const toUser = checkIfUser;
      const paidItems = await payAll(msg.author.id, toUser);
      const amount = chain(paidItems)
        .map((item) => getDividend(item))
        .sum()
        .round(ROUND_PRECISION)
        .value();
      if (amount) {
        msg.channel.send(`<@!${toUser}>에게 ${amount} 상환 완료!`);
        Promise.all(
          map(paidItems, async (item) => {
            if (item.to.length === item.pay.length) {
              await deleteBossItem(guild.id, item.itemId);
              msg.channel.send(
                escapeDiscord(
                  `[${item.itemId}] ${item.itemName} 상환이 완료되어 삭제합니다.`
                )
              );
            }
          })
        );
      }
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
    const existUserIds = userIds.filter(
      (userId) => prevItem.to.includes(userId) && !prevItem.pay.includes(userId)
    );

    const bossItem = await updateBossItem(
      guild.id,
      itemId,
      {},
      { pay: existUserIds }
    );
    if (bossItem) {
      msg.channel.send(
        escapeDiscord(
          `[${itemId}]: ${bossItem.itemName} ${existUserIds.length}명 상환 완료!`
        )
      );
      if (bossItem.to.length === bossItem.pay.length) {
        await deleteBossItem(guild.id, bossItem.itemId);
        msg.channel.send(
          escapeDiscord(
            `[${itemId}] ${bossItem.itemName} 상환이 완료되어 삭제합니다.`
          )
        );
      }
    }
  };

  const list = async (cmd: string): Promise<void> => {
    if (cmd === "me" || cmd === "") {
      const bossItems = await getAllBossItems(guild.id);
      const myUserId = msg.author.id;
      const myBossItems = filter(
        bossItems,
        (item) =>
          item.from === myUserId ||
          (item.to.includes(myUserId) && !item.pay.includes(myUserId))
      );
      if (cmd === "me") {
        const description = myBossItems
          .map((item) => {
            return `${item.itemId}${
              item.price ? ` (${getDividend(item)})` : ""
            } : ${item.itemName} <@!${item.from}>`;
          })
          .join("\n");
        msg.channel.send(
          new MessageEmbed({
            title: `${msg.member?.displayName}의 아이템`,
            description: escapeDiscord(description),
          })
        );
        return;
      }
      if (cmd === "") {
        const [itemsToGive, itemsToGet] = partition(
          filter(myBossItems, (item) => !!item.price),
          (item) => item.from === myUserId
        );

        const sumToGive: { [userId: string]: number } = {};
        const sumToGet: { [userId: string]: number } = {};

        forEach(itemsToGive, (item) => {
          forEach(item.to, (toUser) => {
            if (item.pay.includes(toUser)) return;
            const prevPrice = sumToGive[toUser];
            const dividend = getDividend(item);
            sumToGive[toUser] = round(
              dividend + (prevPrice ?? 0),
              ROUND_PRECISION
            );
          });
        });

        forEach(itemsToGet, (item) => {
          if (item.pay.includes(myUserId)) return;
          const fromUser = item.from;
          const prevPrice = sumToGet[fromUser];
          const dividend = getDividend(item);
          sumToGet[fromUser] = round(
            dividend + (prevPrice ?? 0),
            ROUND_PRECISION
          );
        });

        const giveDescription = map(sumToGive, (amount, userId) => {
          return `<@!${userId}> ${amount}`;
        }).join("\n");
        const getDescription = map(sumToGet, (amount, userId) => {
          return `<@!${userId}> ${amount}`;
        }).join("\n");
        msg.channel.send(
          new MessageEmbed({
            title: `${msg.member?.displayName} 받을/줄 돈`,
            description: `받을 돈\n${getDescription}\n줄 돈\n${giveDescription}`,
          })
        );
        return;
      }
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
          title: `모든 아이템`,
          description: escapeDiscord(description),
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
        description: escapeDiscord(description),
      })
    );
  };

  const rename = async (cmd: string): Promise<void> => {
    const [itemId, newName] = cmd.split(" ");
    if (!itemId || !newName) return;
    const bossItem = await updateBossItem(
      guild.id,
      itemId,
      { itemName: newName },
      {}
    );
    if (bossItem) {
      msg.channel.send(
        escapeDiscord(`[${bossItem.itemId}]: ${bossItem.itemName} 개명 완료`)
      );
    }
  };

  if (message.startsWith("boss ")) {
    const cmd = message.substring(5);
    const action = cmd.split(" ")[0];

    switch (action) {
      case "help":
        help();
        break;
      case "add":
        await add(cmd.substring(4));
        break;
      case "remove":
      case "delete":
        await remove(cmd.substring(7));
        break;
      case "price":
        await updatePrice(cmd.substring(6));
        break;
      case "pay":
        await pay(cmd.substring(4));
        break;
      case "list":
        await list(cmd.substring(5));
        break;
      case "rename":
        await rename(cmd.substring(7));
        break;
      default:
        logger.log("Boss: Wrong action", { cmd });
    }
  }
};

export default boss;
