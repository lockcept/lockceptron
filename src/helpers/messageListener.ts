import Discord from "discord.js";
import logger from "./logger";
import parseMessage from "./parseMessage";

export type MessageListener = (_: Discord.Message, __: string) => Promise<void>;

const addMessageListener = (
  client: Discord.Client,
  messageListener: MessageListener
) => {
  const wrappedListner = async (msg: Discord.Message): Promise<void> => {
    try {
      if (msg.author.bot) return;
      const parsedMsg = parseMessage(msg.content);
      if (!parsedMsg) return;
      await messageListener(msg, parsedMsg);
    } catch (e) {
      logger.error("MessageListener", e);
    }
  };
  client.on("messageCreate", wrappedListner);
};

export default addMessageListener;
