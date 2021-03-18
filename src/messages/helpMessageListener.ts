import { MessageListener } from '../helpers/addMessageListener';

const help:MessageListener = (msg) => {
  if (msg.content === 'tron help') {
    msg.channel.send('Hi! I am lockceptron');
  }
};

export default help;
