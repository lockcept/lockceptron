import { DiscordChannel, ServiceCallback } from "../helpers/type";
import { putMemoItem, getMemoItem } from "../dynamodb/memo";

export const saveMemo = async (
  channel: DiscordChannel,
  guild: string,
  user: string,
  content: string,
  callback?: ServiceCallback
) => {
  const done = callback ?? channel.send.bind(channel);
  await putMemoItem(guild, user, content);
  await done("메모가 저장 되었습니다.");
};

export const loadMemo = async (
  channel: DiscordChannel,
  guild: string,
  user: string,
  callback?: ServiceCallback
) => {
  const done = callback ?? channel.send.bind(channel);
  const load = await getMemoItem(guild, user);
  if (!load) {
    await done("저장된 메모가 없습니다.");
    return;
  }
  await done(load);
};
