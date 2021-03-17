import Discord from 'discord.js';
import addMessageListener from './helpers/addMessageListener';
import save from './messages/dbMessageListener';
import tmp from './messages/tmpMessageListener';

const main = (client:Discord.Client) => {
  addMessageListener(client, tmp);
  addMessageListener(client, save);
};

export default main;
