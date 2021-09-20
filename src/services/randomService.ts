import { chain, random, range } from "lodash";
import { DiscordChannel } from "../helpers/type";

const getOne = (candidates: string[]): string => {
  return candidates[random(candidates.length - 1)];
};
const getMulti = (candidates: string[], count: number): string => {
  return chain(range(count))
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

export const pickRandomOnce = async (
  channel: DiscordChannel,
  candidates: string[]
) => {
  channel.send(getOne(candidates));
};

export const pickRandomMulti = async (
  channel: DiscordChannel,
  candidates: string[],
  count: number
) => {
  const MAX_TRY = 1000000;

  const newCount = count > MAX_TRY ? MAX_TRY : count;
  if (count > MAX_TRY) await channel.send(`MAX: ${MAX_TRY}`);
  channel.send(getMulti(candidates, newCount));
};
