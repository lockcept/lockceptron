import { ApplicationCommandData, CommandInteraction } from "discord.js";
import { isEmpty } from "lodash";
import { pickRandomMulti, pickRandomOnce } from "../services/randomService";
import {
  CommandHandler,
  CommandInteractionHandler,
} from "../helpers/commandHandler";

const COMMAND_NAME = "random";

const commandData: ApplicationCommandData = {
  name: COMMAND_NAME,
  description: "random",
  options: [
    {
      name: "once",
      description: "Pick once",
      type: "SUB_COMMAND",
      options: [
        {
          name: "candidates",
          description: "Candidates to pick, separate by blank",
          type: "STRING",
          required: true,
        },
      ],
    },
    {
      name: "multi",
      description: "Pick multiple times",
      type: "SUB_COMMAND",
      options: [
        {
          name: "n",
          type: "NUMBER",
          description: "Counts to try",
          required: true,
        },
        {
          name: "candidates",
          description: "Candidates to pick, separate by blank",
          type: "STRING",
          required: true,
        },
      ],
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
  if (subCommand === "multi") {
    const n = options.getNumber("n", true);
    const candidates = options.getString("candidates", true).split(" ");

    if (isEmpty(candidates)) {
      await interaction.editReply("Invalid Candidates");
      return;
    }

    await pickRandomMulti(
      interaction.channel,
      candidates,
      n,
      async (message) => {
        interaction.editReply(message);
      }
    );
  }
  if (subCommand === "once") {
    const candidates = options.getString("candidates", true).split(" ");

    if (isEmpty(candidates)) {
      await interaction.editReply("Invalid Candidates");
      return;
    }

    await pickRandomOnce(interaction.channel, candidates, async (message) => {
      interaction.editReply(message);
    });
  }
};

const commandHandler: CommandHandler = {
  commandData,
  commandInteractionHandler,
};

export default commandHandler;
