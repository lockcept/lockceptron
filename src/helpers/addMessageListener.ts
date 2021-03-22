import Discord from "discord.js";
import parseMessage from "./parseMessage";

export type MessageListener = (_: Discord.Message, __: string) => void;

const addMessageListener = (
  client: Discord.Client,
  messageListener: MessageListener
) => {
  const wrappedListner = (msg: Discord.Message): void => {
    const parsedMsg = parseMessage(msg.content);
    if (!parsedMsg) return;
    messageListener(msg, parsedMsg);
  };
  client.on("message", wrappedListner);
};

export default addMessageListener;
