import Discord from "discord.js";
import fs from "fs";
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
};

export default main;
