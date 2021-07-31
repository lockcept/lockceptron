import { MessageEmbed } from "discord.js";
import { chain } from "lodash";
import { customAlphabet } from "nanoid";
import { getBossItem, addItem } from "../dynamodb/boss";

import { MessageListener } from "../helpers/addMessageListener";
import logger from "../helpers/logger";

const boss: MessageListener = async (msg, message) => {
  const getUserId = (rawString: string): string | null => {
    const result = rawString.match(/^<@!([0-9]+)>$/i);
    if (!result) return null;
    return result[1];
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

    const itemId = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyz", 10)();
    const fromUser = msg.author.id;
    addItem(guild.id, itemId, item, fromUser, userIds);
    msg.channel.send(`[${itemId}]: ${item} 등록 완료!`);
  };
  const remove = (rawString: string): void => {};
  const price = (rawString: string): void => {};
  const pay = (rawString: string): void => {};
  const list = async (rawString: string): Promise<void> => {
    if (rawString === "me") {
      // TODO
      msg.channel.send("Not Implemented");
      return;
    }
    if (rawString === "all") {
      // TODO
      msg.channel.send("Not Implemented");
      return;
    }
    const itemId = rawString;
    const bossItem = await getBossItem(guild.id, itemId);
    if (!bossItem) {
      msg.channel.send("아이템을 찾을 수 없습니다!");
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
        price(cmd.substring(6));
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
