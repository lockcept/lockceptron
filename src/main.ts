import Discord, { ApplicationCommandData } from "discord.js";
import fs from "fs";
import { CommandHandler } from "./helpers/commandHandler";
import logger from "./helpers/logger";
import addMessageListener, { MessageListener } from "./helpers/messageListener";

const main = async (client: Discord.Client) => {
  const messageFiles = fs
    .readdirSync("./src/messages")
    .filter((file) => file.endsWith(".ts"));

  await Promise.all(
    messageFiles.map(async (file) => {
      const { default: message }: { default: MessageListener } = await import(
        `./messages/${file}`
      );
      addMessageListener(client, message);
    })
  );

  if (!client.application) return;

  const commandFiles = fs
    .readdirSync("./src/commands")
    .filter((file) => file.endsWith(".ts"));

  const commandDatas: ApplicationCommandData[] = [];

  await Promise.all(
    commandFiles.map(async (file) => {
      const {
        default: { commandData, commandInteractionHandler },
      }: { default: CommandHandler } = await import(`./commands/${file}`);

      commandDatas.push(commandData);

      client.on("interactionCreate", async (interaction) => {
        if (!interaction.isCommand()) return;
        logger.log("interactionCreate log", {
          commandId: interaction.commandId,
          commandName: interaction.commandName,
          options: interaction.options,
        });
        try {
          await commandInteractionHandler(interaction);
        } catch (e) {
          logger.error("interactionCreate", e);
        }
      });
    })
  );

  await client.application.commands.set(commandDatas);
};

export default main;
