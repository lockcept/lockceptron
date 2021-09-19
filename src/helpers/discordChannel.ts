import Discord from "discord.js";

type DiscordChannel =
  | Discord.PartialDMChannel
  | Discord.DMChannel
  | Discord.TextChannel
  | Discord.NewsChannel
  | Discord.ThreadChannel;

export default DiscordChannel;
