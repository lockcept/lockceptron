import { MessageListener } from "../helpers/addMessageListener";
import { loadMemo } from "../services/memoService";

const memo: MessageListener = async (msg, message) => {
  if (!msg.guild) throw Error("guild not found");
  if (message === "memo") {
    loadMemo(msg);
  }
  if (message.startsWith("memo")) {
    if (!msg.guild) throw Error("guild not found");
    saveMemo(msg.guild.id, msg.author.id, message.substring(5));
  }
};

export default memo;
