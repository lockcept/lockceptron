import { MessageListener } from "../helpers/addMessageListener";
import substring from "../helpers/substring";
import { loadMemo, saveMemo } from "../services/memoService";

const memo: MessageListener = async (msg, message) => {
  if (!msg.guild) throw Error("guild not found");

  if (message === "memo") {
    await loadMemo(msg.channel, msg.guild.id, msg.author.id);
    return;
  }

  if (message.startsWith("memo")) {
    await saveMemo(
      msg.channel,
      msg.guild.id,
      msg.author.id,
      substring(message, "memo")
    );
  }
};

export default memo;
