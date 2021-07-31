import discordClient from "../app";
import { loadMemo, saveMemo } from "../dynamodb/memo";
import { MessageListener } from "../helpers/addMessageListener";

const memo: MessageListener = async (msg, message) => {
  if (msg.author.id === discordClient.user?.id) return;
  if (message === "memo") {
    if (!msg.guild) throw Error("guild not found");
    const load = await loadMemo(msg.guild.id, msg.author.id);
    if (!load) return;
    msg.channel.send(load);
    return;
  }
  if (message.startsWith("memo")) {
    if (!msg.guild) throw Error("guild not found");
    saveMemo(msg.guild.id, msg.author.id, message.substring(5));
  }
};

export default memo;
