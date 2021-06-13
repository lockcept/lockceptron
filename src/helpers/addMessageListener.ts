import Discord from "discord.js";
import logger from "./logger";
import parseMessage from "./parseMessage";

export type MessageListener = (_: Discord.Message, __: string) => void;

const addMessageListener = (
  client: Discord.Client,
  messageListener: MessageListener
) => {
  const wrappedListner = (msg: Discord.Message): void => {
    try {
      if (msg.author.bot) return;
      const parsedMsg = parseMessage(msg.content);
      if (!parsedMsg) return;
      messageListener(msg, parsedMsg);
    } catch (e) {
      logger.error(e);
    }
  };
  client.on("message", wrappedListner);
};

export default addMessageListener;
