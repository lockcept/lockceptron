import { MessageListener } from "../helpers/addMessageListener";
import logger from "../helpers/logger";

const boss: MessageListener = (msg, message) => {
  const getUserId = (rawString: string): string | null => {
    const result = rawString.match(/^<@!([0-9]+)>$/i);
    if (!result) return null;
    return result[1];
  };
  const add = (cmd: string): void => {};
  const remove = (message: string): void => {};
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
      case "list":
        list(cmd.substring(5));
        break;
      default:
        logger.log("Boss: Wrong action", { cmd });
    }
  }
};

export default boss;
