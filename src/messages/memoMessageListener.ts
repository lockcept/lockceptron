import discordClient from '../app';
import { loadMemo, saveMemo } from '../dynamodb/memo';
import { MessageListener } from '../helpers/addMessageListener';

const memo:MessageListener = async (msg) => {
  if (msg.author.id === discordClient.user?.id) return;
  if (msg.content === 'tron memo') {
    const load = await loadMemo(msg.author.id);
    if (!load) return;
    msg.channel.send(load);
    return;
  }
  if (msg.content.startsWith('tron memo')) {
    saveMemo(msg.author.id, msg.content.substring(10));
  }
};

export default memo;
