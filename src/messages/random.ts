import yargsParser from "yargs-parser";
import { pickRandomMulti, pickRandomOnce } from "../services/randomService";
import { MessageListener } from "../helpers/addMessageListener";
import logger from "../helpers/logger";
import substring from "../helpers/substring";

const randomPick: MessageListener = async (msg, message) => {
  if (message.startsWith("random ")) {
    const args = yargsParser(substring(message, "random"));
    const count: number = args.n ? parseInt(args.n, 10) : 0;
    if (args.n && !count) {
      msg.channel.send("invalid argument {n}");
      logger.log("[random]: invalid argument", { args: args.n });
      return;
    }

    const candidates = args._;
    if (candidates.length === 0) {
      msg.channel.send("invalid candidates");
      logger.log("[random]: invalid candidates");
      return;
    }

    logger.log("random args", args);

    if (!count || count < 0) {
      await pickRandomOnce(msg.channel, candidates);
      return;
    }

    await pickRandomMulti(msg.channel, candidates, count);
  }
};

export default randomPick;
