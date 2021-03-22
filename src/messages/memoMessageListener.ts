import discordClient from '../app';
import { loadMemo, saveMemo } from '../dynamodb/memo';
import { MessageListener } from '../helpers/addMessageListener';

const memo:MessageListener = async (msg, message) => {
  if (msg.author.id === discordClient.user?.id) return;
  if (message === 'memo') {
    const load = await loadMemo(msg.author.id);
    if (!load) return;
    msg.channel.send(load);
    return;
  }
  if (message.startsWith('memo')) {
    saveMemo(msg.author.id, msg.content.substring(5));
  }
};

export default memo;
