import Discord from 'discord.js';
import { discordToken } from './config';
import main from './main';

const client = new Discord.Client();
client.login(discordToken);

client.on('ready', () => {
  console.log(`Logged in as ${client.user?.tag}!`);
});

main(client);
