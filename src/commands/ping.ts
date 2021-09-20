import { ApplicationCommandData, CommandInteraction } from "discord.js";
import {
  CommandHandler,
  CommandInteractionHandler,
} from "../helpers/commandHandler";

const COMMAND_NAME = "lock";

const commandData: ApplicationCommandData = {
  name: COMMAND_NAME,
  description: "ping pong",
};

const commandInteractionHandler: CommandInteractionHandler = async (
  interaction: CommandInteraction
) => {
  if (interaction.commandName !== COMMAND_NAME) return;
  await interaction.reply("cept");
};

const commandHandler: CommandHandler = {
  commandData,
  commandInteractionHandler,
};

export default commandHandler;
