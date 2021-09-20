import {
  ApplicationCommandChoicesData,
  ApplicationCommandData,
  CommandInteraction,
} from "discord.js";
import { chain, isEmpty, map, range } from "lodash";
import { pickRandomMulti, pickRandomOnce } from "../services/randomService";
import {
  CommandHandler,
  CommandInteractionHandler,
} from "../helpers/commandHandler";

const COMMAND_NAME = "random";
const ARGMAX = 9;
const args: ApplicationCommandChoicesData[] = map(range(ARGMAX), (idx) => {
  return { name: `arg${idx}`, type: "STRING", description: `arg${idx}` };
});

const commandData: ApplicationCommandData = {
  name: COMMAND_NAME,
  description: "random",
  options: [
    {
      name: "once",
      description: "Pick once",
      type: "SUB_COMMAND",
      options: [...args],
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
        ...args,
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
    const candidates = chain(args)
      .map((arg) => options.getString(arg.name))
      .compact()
      .value();

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
    const candidates = chain(args)
      .map((arg) => options.getString(arg.name))
      .compact()
      .value();

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
