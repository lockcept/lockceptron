import Discord from 'discord.js';
import { discordToken } from './config';
// eslint-disable-next-line no-console

const client = new Discord.Client();
client.login(discordToken);

client.on('ready', () => {
  console.log(`Logged in as ${client.user?.tag}!`);
});
client.on('message', (msg) => {
  if (msg.content === 'ping') {
    msg.reply('pong');
  }
});

console.log('asdf');
