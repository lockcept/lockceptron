import { ApplicationCommandData, CommandInteraction } from "discord.js";

export type CommandInteractionHandler = (
  _interaction: CommandInteraction
) => Promise<void>;

export type CommandHandler = {
  commandData: ApplicationCommandData;
  commandInteractionHandler: CommandInteractionHandler;
};
