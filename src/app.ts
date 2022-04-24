import Discord from "discord.js";
import { DISCORD_TOKEN_BY_STAGE } from "./environments";
import logger from "./helpers/logger";
import main from "./main";

const intents = new Discord.Intents();
intents.add("GUILDS", "GUILD_MESSAGES", "GUILD_MEMBERS");
const discordClient = new Discord.Client({ intents });
discordClient.login(DISCORD_TOKEN_BY_STAGE);

discordClient.on("ready", () => {
  logger.log(`App: Logged in as ${discordClient.user?.tag}!`);
  main(discordClient);
});

export default discordClient;
