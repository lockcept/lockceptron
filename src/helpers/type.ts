import Discord from "discord.js";

export type DiscordChannel =
  | Discord.PartialDMChannel
  | Discord.DMChannel
  | Discord.TextChannel
  | Discord.NewsChannel
  | Discord.ThreadChannel;

export type ServiceCallback = (_message: string) => Promise<void>;
