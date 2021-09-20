import { ApplicationCommandData, CommandInteraction } from "discord.js";
import {
  CommandHandler,
  CommandInteractionHandler,
} from "../helpers/commandHandler";
import { loadMemo, saveMemo } from "../services/memoService";

const COMMAND_NAME = "memo";

const commandData: ApplicationCommandData = {
  name: COMMAND_NAME,
  description: "memo",
  options: [
    {
      name: "save",
      type: "SUB_COMMAND",
      description: "Save a memo",
      options: [
        {
          name: "memo",
          description: "The memo to save",
          type: "STRING",
          required: true,
        },
      ],
    },
    {
      name: "load",
      type: "SUB_COMMAND",
      description: "Load a memo",
    },
  ],
};

const commandInteractionHandler: CommandInteractionHandler = async (
  interaction: CommandInteraction
) => {
  if (interaction.commandName !== COMMAND_NAME) return;
  if (!interaction.channel || !interaction.guild) return;
  await interaction.deferReply();
  const { options } = interaction;
  const subCommand = options.getSubcommand();
  if (subCommand === "save") {
    const memo = options.get("memo", true).value;
    if (typeof memo !== "string") return;

    await saveMemo(
      interaction.channel,
      interaction.guild.id,
      interaction.user.id,
      memo,
      async (message) => {
        await interaction.editReply(message);
      }
    );
  }
  if (subCommand === "load") {
    await loadMemo(
      interaction.channel,
      interaction.guild.id,
      interaction.user.id,
      async (message) => {
        await interaction.editReply(message);
      }
    );
  }
};

const commandHandler: CommandHandler = {
  commandData,
  commandInteractionHandler,
};

export default commandHandler;
