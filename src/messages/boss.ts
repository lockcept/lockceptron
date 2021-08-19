import { chain } from "lodash";
import {
  receiptBoss,
  updateBossPrice,
  addBoss,
  helpBoss,
  removeBoss,
  payBossUser,
  payBossItem,
  listBoss,
  infoBoss,
  renameBoss,
} from "../services/bossService";

import { MessageListener } from "../helpers/addMessageListener";
import logger from "../helpers/logger";
import substring from "../helpers/substring";

const boss: MessageListener = async (msg, message) => {
  const getUserId = (cmd: string): string | null => {
    const result = cmd.match(/^<@!([0-9]+)>$/i);
    if (!result) return null;
    return result[1];
  };

  const { guild } = msg;
  if (!guild) throw Error("guild not found");

  const add = async (cmd: string): Promise<void> => {
    const [item, ...users] = cmd.split(" ");
    if (getUserId(item)) {
      await msg.channel.send("잘못된 아이템입니다.");
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
    if (userIds.length === 0) {
      await msg.channel.send("유저를 입력해 주세요.");
      return;
    }

    const itemName = item.substring(0, 20);
    await addBoss(msg.channel, guild.id, itemName, fromUser, userIds);
  };

  const remove = async (cmd: string): Promise<void> => {
    const itemId = cmd;
    await removeBoss(msg.channel, guild.id, itemId, msg.author.id);
  };

  const updatePrice = async (cmd: string): Promise<void> => {
    const words = cmd.split(" ");
    if (words.length < 2) {
      await msg.channel.send("잘못된 입력입니다.");
      return;
    }
    const itemId = words[0];
    const price = parseInt(words[1], 10);
    const commission = words?.[2] ? parseFloat(words?.[2]) : undefined;

    await updateBossPrice(msg.channel, guild.id, itemId, price, commission);
  };

  const pay = async (cmd: string): Promise<void> => {
    const [itemId, ...users] = cmd.split(" ");
    const checkIfUser = getUserId(itemId);

    if (checkIfUser) {
      const toUser = checkIfUser;
      await payBossUser(msg.channel, guild.id, msg.author.id, toUser);
      return;
    }

    const userIds = chain(users)
      .map((user) => {
        return getUserId(user);
      })
      .compact()
      .value();
    if (userIds.length === 0) {
      await msg.channel.send("잘못된 입력입니다.");
      return;
    }
    await payBossItem(msg.channel, guild.id, itemId, msg.author.id, userIds);
  };

  const receipt = async (cmd: string): Promise<void> => {
    if (cmd !== "") {
      await msg.channel.send("잘못된 입력입니다.");
      return;
    }

    await receiptBoss(msg.channel, guild.id, msg.author.id);
  };

  const list = async (cmd: string): Promise<void> => {
    if (cmd === "") {
      await listBoss(msg.channel, guild.id, msg.author.id);
      return;
    }

    if (cmd === "all") {
      await listBoss(msg.channel, guild.id);
    }
  };

  const info = async (cmd: string): Promise<void> => {
    const itemId = cmd;
    await infoBoss(msg.channel, guild.id, itemId);
  };

  const rename = async (cmd: string): Promise<void> => {
    const [itemId, newName] = cmd.split(" ");
    if (!itemId || !newName) {
      await msg.channel.send("잘못된 입력입니다.");
    }

    await renameBoss(msg.channel, guild.id, itemId, newName);
  };

  if (message.startsWith("boss ")) {
    const cmd = substring(message, "boss");
    const action = cmd.split(" ")[0];
    if (!action) {
      msg.channel.send("잘못된 Boss Command 입니다.");
      return;
    }
    const commands = substring(cmd, action);

    switch (action) {
      case "help":
        await helpBoss(msg.channel);
        break;
      case "add":
        await add(commands);
        break;
      case "remove":
      case "delete":
        await remove(commands);
        break;
      case "price":
        await updatePrice(commands);
        break;
      case "pay":
        await pay(commands);
        break;
      case "receipt":
        await receipt(commands);
        break;
      case "list":
        await list(commands);
        break;
      case "info":
        await info(commands);
        break;
      case "rename":
        await rename(commands);
        break;
      default:
        msg.channel.send("잘못된 Boss Command 입니다.");
        logger.log("Boss: Wrong action", { cmd });
    }
  }
};

export default boss;
