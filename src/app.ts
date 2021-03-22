import Discord from 'discord.js';
import { discordTokenByStage } from './config';
import logger from './helpers/logger';
import main from './main';

const discordClient = new Discord.Client();
discordClient.login(discordTokenByStage);

discordClient.on('ready', () => {
  logger.log(`Logged in as ${discordClient.user?.tag}!`);
});

main(discordClient);

export default discordClient;
