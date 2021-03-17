import { MessageListener } from '../helpers/addMessageListener';

const tmp:MessageListener = (msg) => {
  if (msg.content === 'tron help') {
    msg.channel.send('Hi! I am lockceptron');
  }
};

export default tmp;
