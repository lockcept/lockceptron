import Discord from 'discord.js';
import { discordToken } from './config';
import addMessageListener from './helpers/addMessageListener';
import tmp from './messages/tmpMessageListener';

const client = new Discord.Client();
client.login(discordToken);

client.on('ready', () => {
  console.log(`Logged in as ${client.user?.tag}!`);
});

addMessageListener(client, tmp);
