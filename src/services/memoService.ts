import { putMemoItem, getMemoItem } from "../dynamodb/memo";

import DiscordChannel from "../helpers/discordChannel";

export const loadMemo = async (
  channel: DiscordChannel,
  guild: string,
  user: string
) => {
  const load = await getMemoItem(guild, user);
  if (!load) {
    await channel.send("저장된 메모가 없습니다.");
    return;
  }
  await channel.send(load);
};

export const saveMemo = async (
  channel: DiscordChannel,
  guild: string,
  user: string,
  content: string
) => {
  await putMemoItem(guild, user, content);
  await channel.send("메모가 저장 되었습니다.");
};
