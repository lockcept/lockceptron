import { getMemoItem } from "../dynamodb/memo";
import DiscordChannel from "../helpers/discordChannel";

export const loadMemo = async (
  channel: DiscordChannel,
  guild: string,
  user: string
) => {
  const load = await getMemoItem(guild, user);
  if (!load) return;
  channel.send(load);
};

export const saveMemo;
