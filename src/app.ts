import Discord from 'discord.js';
import { discordToken } from './config';
import main from './main';

const discordClient = new Discord.Client();
discordClient.login(discordToken);

discordClient.on('ready', () => {
  console.log(`Logged in as ${discordClient.user?.tag}!`);
});

main(discordClient);

export default discordClient;
