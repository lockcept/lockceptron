import { chain } from "lodash";
import { customAlphabet } from "nanoid";
import { addItem } from "../dynamodb/boss";
import { MessageListener } from "../helpers/addMessageListener";
import logger from "../helpers/logger";

const boss: MessageListener = (msg, message) => {
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
  const remove = (message: string): void => {};
  const pay = (message: string): void => {};
  const list = (message: string): void => {};

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
      case "pay":
        remove(cmd.substring(4));
        break;
      case "list":
        list(cmd.substring(5));
        break;
      default:
        logger.log("Boss: Wrong action", { cmd });
    }
  }
};

export default boss;
