import {
  ApplicationCommandData,
  CommandInteraction,
  GuildMember,
} from "discord.js";
import { compact, filter, isEmpty } from "lodash";
import {
  updateBossPrice,
  removeBoss,
  addBoss,
  listBoss,
  receiptBoss,
  infoBoss,
  renameBoss,
  payBossUser,
  payBossItem,
} from "../services/bossService";
import {
  CommandHandler,
  CommandInteractionHandler,
} from "../helpers/commandHandler";
import { getUserId, getUsersFromIds } from "../helpers/parseDiscordId";

const COMMAND_NAME = "boss";

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
        {
          name: "users",
          description: "Users to pay. Tag User or Role",
          type: "STRING",
          required: true,
        },
      ],
    },
    {
      name: "remove",
      type: "SUB_COMMAND",
      description: "Remove a boss item",
      options: [
        {
          name: "item",
          description: "The item id to remove",
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
          description: "The item id to register price",
          type: "STRING",
          required: true,
        },
        {
          name: "price",
          description: "The price of item",
          type: "NUMBER",
          required: true,
        },
        {
          name: "commission",
          description: "The commision of item",
          type: "NUMBER",
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
      type: "SUB_COMMAND_GROUP",
      description: "List boss items",
      options: [
        {
          name: "me",
          type: "SUB_COMMAND",
          description: "List your boss items",
        },
        {
          name: "all",
          type: "SUB_COMMAND",
          description: "List all boss items",
        },
      ],
    },
    {
      name: "info",
      type: "SUB_COMMAND",
      description: "Show info about the boss item",
      options: [
        {
          name: "item",
          description: "Item id to show info",
          type: "STRING",
          required: true,
        },
      ],
    },
    {
      name: "rename",
      type: "SUB_COMMAND",
      description: "Rename a boss item",
      options: [
        {
          name: "item",
          description: "Item id to rename",
          type: "STRING",
          required: true,
        },
        {
          name: "name",
          description: "New name to register",
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
  const subCommandGroup = options.getSubcommandGroup(false);
  if (!subCommandGroup && subCommand === "add") {
    const item = options.getString("item", true);
    const users = options.getString("users", true);
    const allUserIds = await getUsersFromIds(
      interaction.guild,
      users.split(" ")
    );
    const fromUser = interaction.user.id;
    const userIds = filter(allUserIds, (userId) => userId !== fromUser);

    if (isEmpty(userIds)) {
      await interaction.editReply("Invalid Users");
      return;
    }

    const itemName = item.substring(0, 20);
    await addBoss(
      interaction.channel,
      interaction.guild.id,
      itemName,
      fromUser,
      userIds,
      async (message) => {
        interaction.editReply(message);
      }
    );
  }
  if (!subCommandGroup && subCommand === "remove") {
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
  if (!subCommandGroup && subCommand === "price") {
    const item = options.getString("item", true);
    const price = options.getNumber("price", true);
    const commission = options.getNumber("commission");
    await updateBossPrice(
      interaction.channel,
      interaction.guild.id,
      item,
      price,
      commission ?? undefined,
      async (message) => {
        interaction.editReply(message);
      }
    );
  }
  if (subCommandGroup === "pay") {
    if (subCommand === "user") {
      const user = options.getString("user", true);
      if (!getUserId(user)) {
        await interaction.editReply("Invalid User");
        return;
      }
      await payBossUser(
        interaction.channel,
        interaction.guild.id,
        interaction.user.id,
        user,
        async (message) => {
          interaction.editReply(message);
        }
      );
    }
    if (subCommand === "item") {
      const item = options.getString("item", true);
      const users = options.getString("users", true);
      const userIds = compact(
        filter(users.split(" "), (userId) => !!getUserId(userId))
      );

      await payBossItem(
        interaction.channel,
        interaction.guild.id,
        item,
        interaction.user.id,
        userIds,
        async (message) => {
          interaction.editReply(message);
        }
      );
    }
  }
  if (!subCommandGroup && subCommand === "receipt") {
    const { member } = interaction;
    if (member instanceof GuildMember) {
      await receiptBoss(
        interaction.channel,
        interaction.guild.id,
        interaction.user.id,
        member.displayName
      );
    }
    await interaction.deleteReply();
  }
  if (subCommandGroup === "list") {
    if (subCommand === "me") {
      const { member } = interaction;
      if (member instanceof GuildMember) {
        const { displayName } = member;
        await listBoss(
          interaction.channel,
          interaction.guild.id,
          interaction.user.id,
          displayName
        );
      }
      await interaction.deleteReply();
    }
    if (subCommand === "all") {
      await listBoss(interaction.channel, interaction.guild.id);
      await interaction.deleteReply();
    }
  }
  if (!subCommandGroup && subCommand === "info") {
    const item = options.getString("item", true);
    await infoBoss(interaction.channel, interaction.guild.id, item);
    await interaction.deleteReply();
  }
  if (!subCommandGroup && subCommand === "rename") {
    const item = options.getString("item", true);
    const name = options.getString("name", true);
    await renameBoss(
      interaction.channel,
      interaction.guild.id,
      item,
      name,
      async (message) => {
        interaction.editReply(message);
      }
    );
  }
};

const commandHandler: CommandHandler = {
  commandData,
  commandInteractionHandler,
};

export default commandHandler;
