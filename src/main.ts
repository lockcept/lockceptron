import Discord from 'discord.js';
import addMessageListener from './helpers/addMessageListener';
import help from './messages/helpMessageListener';
import memo from './messages/memoMessageListener';

const main = (client:Discord.Client) => {
  addMessageListener(client, help);
  addMessageListener(client, memo);
};

export default main;
