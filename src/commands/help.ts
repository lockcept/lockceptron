import { ApplicationCommandData, CommandInteraction } from "discord.js";
import {
  CommandHandler,
  CommandInteractionHandler,
} from "../helpers/commandHandler";
import { sendHelp } from "../services/helpService";

const COMMAND_NAME = "help";

const commandData: ApplicationCommandData = {
  name: COMMAND_NAME,
  description: "lockceptron help!",
};

const commandInteractionHandler: CommandInteractionHandler = async (
  interaction: CommandInteraction
) => {
  if (interaction.commandName !== COMMAND_NAME) return;
  if (!interaction.channel) return;
  await interaction.deferReply();
  await sendHelp(interaction.channel);
  await interaction.reply("Done!");
};

const commandHandler: CommandHandler = {
  commandData,
  commandInteractionHandler,
};

export default commandHandler;
