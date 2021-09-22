import {
  ApplicationCommandChoicesData,
  ApplicationCommandData,
  ApplicationCommandNonOptionsData,
  CommandInteraction,
} from "discord.js";
import { map, range } from "lodash";
import {
  CommandHandler,
  CommandInteractionHandler,
} from "../helpers/commandHandler";
import { removeBoss } from "../services/bossService";

const COMMAND_NAME = "boss";
const ARGMAX = 9;
const userArgs: ApplicationCommandChoicesData[] = map(range(ARGMAX), (idx) => {
  return {
    name: `user${idx}`,
    type: "STRING",
    description: `user${idx}`,
  };
});
const mentionableArgs: ApplicationCommandNonOptionsData[] = map(
  range(ARGMAX),
  (idx) => {
    return {
      name: `user${idx}`,
      type: "MENTIONABLE",
      description: `user${idx}`,
    };
  }
);

const commandData: ApplicationCommandData = {
  name: COMMAND_NAME,
  description: "boss",
  options: [
    {
      name: "add",
      type: "SUB_COMMAND",
      description: "Add a boss item",
      options: [
        {
          name: "item",
          description: "The item name to add",
          type: "STRING",
          required: true,
        },
        ...mentionableArgs,
      ],
    },
    {
      name: "remove",
      type: "SUB_COMMAND",
      description: "Remove a boss item",
      options: [
        {
          name: "item",
          description: "The item name to remove",
          type: "STRING",
          required: true,
        },
      ],
    },
    {
      name: "price",
      type: "SUB_COMMAND",
      description: "Register price for the boss item",
      options: [
        {
          name: "item",
          description: "The item name to remove",
          type: "STRING",
          required: true,
        },
      ],
    },
    {
      name: "pay",
      type: "SUB_COMMAND_GROUP",
      description: "Pay the boss item",
      options: [
        {
          name: "user",
          type: "SUB_COMMAND",
          description: "Pay all boss items for user",
          options: [
            {
              name: "user",
              type: "USER",
              description: "User to pay",
              required: true,
            },
          ],
        },
        {
          name: "item",
          description: "Pay the boss item",
          type: "SUB_COMMAND",
          options: [
            {
              name: "item",
              type: "STRING",
              description: "Item to pay",
              required: true,
            },
            ...userArgs,
          ],
        },
      ],
    },
    {
      name: "receipt",
      type: "SUB_COMMAND",
      description: "Show the receipt for you",
    },
    {
      name: "list",
      type: "SUB_COMMAND",
      description: "List your boss items",
    },
    {
      name: "list_all",
      type: "SUB_COMMAND",
      description: "List all boss items",
    },
    {
      name: "info",
      type: "SUB_COMMAND",
      description: "Show info about the boss item",
    },
    {
      name: "rename",
      type: "SUB_COMMAND",
      description: "Rename a boss item",
      options: [
        {
          name: "item",
          description: "Item to rename",
          type: "STRING",
          required: true,
        },
        {
          name: "new name",
          description: "New name",
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
  if (subCommand === "add") {
    //
  }
  if (subCommand === "remove") {
    const item = options.getString("item", true);
    await removeBoss(
      interaction.channel,
      interaction.guild.id,
      item,
      interaction.user.id,
      async (message) => {
        interaction.editReply(message);
      }
    );
  }
  if (subCommand === "price") {
    //
  }
  if (subCommand === "pay") {
    //
  }
  if (subCommand === "receipt") {
    //
  }
  if (subCommand === "list") {
    //
  }
  if (subCommand === "list_all") {
    //
  }
  if (subCommand === "info") {
    //
  }
  if (subCommand === "rename") {
    //
  }
};

const commandHandler: CommandHandler = {
  commandData,
  commandInteractionHandler,
};

export default commandHandler;
