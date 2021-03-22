import { helpDoc } from '../config';
import { MessageListener } from '../helpers/addMessageListener';

const help:MessageListener = (msg, message) => {
  if (message === 'help') {
    msg.channel.send('Hi! I am lockceptron');
    msg.channel.send(helpDoc);
  }
};

export default help;
