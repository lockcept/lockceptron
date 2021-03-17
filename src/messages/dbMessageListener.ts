import { a, b } from '../dynamodb';
import { MessageListener } from '../helpers/addMessageListener';

const save:MessageListener = async (msg) => {
  if (msg.content.startsWith('tron save ')) {
    a(msg.author.id, msg.content.substring(10));
  }
  if (msg.content.startsWith('tron load')) {
    const load = await b(msg.author.id);
    if (!load) return;
    msg.channel.send(load);
  }
};

export default save;
