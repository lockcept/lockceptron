import Discord from "discord.js";

export type DiscordChannel =
  | Discord.PartialDMChannel
  | Discord.DMChannel
  | Discord.TextChannel
  | Discord.NewsChannel
  | Discord.ThreadChannel
  | Discord.VoiceChannel;

export type ServiceCallback = (_message: string) => Promise<void>;
