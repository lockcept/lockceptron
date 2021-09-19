import Discord from "discord.js";
import { discordTokenByStage } from "./config";
import logger from "./helpers/logger";
import main from "./main";

const intents = new Discord.Intents();
intents.add("GUILDS", "GUILD_MESSAGES");
const discordClient = new Discord.Client({ intents });
discordClient.login(discordTokenByStage);

discordClient.on("ready", () => {
  logger.log(`App: Logged in as ${discordClient.user?.tag}!`);
});

main(discordClient);

export default discordClient;
