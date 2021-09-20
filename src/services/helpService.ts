import { MessageEmbed } from "discord.js";
import { helpDoc, whatsNew } from "../config";
import DiscordChannel from "../helpers/discordChannel";

// eslint-disable-next-line import/prefer-default-export
export const sendHelp = async (channel: DiscordChannel) => {
  channel.send("Hi! I am lockceptron");
  channel.send({
    embeds: [
      new MessageEmbed({
        title: "LOCKCEPTRON",
        description: `[What's new?](${whatsNew})\n[Command DOCS](${helpDoc})`,
      }),
    ],
  });
};
