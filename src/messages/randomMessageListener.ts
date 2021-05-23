import { chain, random, range } from "lodash";
import yargsParser from "yargs-parser";
import { MessageListener } from "../helpers/addMessageListener";
import logger from "../helpers/logger";

const randomPick: MessageListener = (msg, message) => {
  if (message.startsWith("random ")) {
    const MAX_TRY = 1000000;
    const args = yargsParser(message.substring(7));
    const number: number = args.n ? parseInt(args.n, 10) : 0;
    if (!number && args.n) {
      msg.channel.send("-n argument invalid");
      logger.log(args.n);
    }
    const candidates = args._;
    if (candidates.length === 0) return;
    logger.log("random args", args);
    const getOne = () => {
      return candidates[random(candidates.length - 1)];
    };
    const getN = (n: number) => {
      return chain(range(n))
        .map(() => {
          return random(candidates.length - 1);
        })
        .countBy()
        .map((cnt, idx) => {
          return {
            cnt,
            idx,
          };
        })
        .sortBy("cnt")
        .reverse()
        .map(({ cnt, idx }) => {
          return `${candidates[Number(idx)]}: ${cnt}`;
        })
        .join("\n")
        .value();
    };
    if (!number || number < 0) {
      msg.channel.send(getOne());
      return;
    }

    const n = number > MAX_TRY ? MAX_TRY : number;
    if (number > MAX_TRY) msg.channel.send(`max: ${MAX_TRY}`);
    msg.channel.send(getN(n));
  }
};

export default randomPick;
