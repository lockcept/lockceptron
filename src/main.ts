import Discord from 'discord.js';
import addMessageListener from './helpers/addMessageListener';
import tmp from './messages/tmpMessageListener';

const main = (client:Discord.Client) => {
  addMessageListener(client, tmp);
};

export default main;
