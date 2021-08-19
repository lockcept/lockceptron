import Discord from "discord.js";

type DiscordChannel =
  | Discord.TextChannel
  | Discord.DMChannel
  | Discord.NewsChannel;

export default DiscordChannel;
