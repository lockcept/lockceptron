import { MessageEmbed } from "discord.js";
import { helpDoc, whatsNew } from "../config";
import { DiscordChannel } from "../helpers/type";

// eslint-disable-next-line import/prefer-default-export
export const sendHelp = async (channel: DiscordChannel) => {
  await channel.send({
    embeds: [
      new MessageEmbed({
        title: "LOCKCEPTRON",
        description: `[What's new?](${whatsNew})\n[Command DOCS](${helpDoc})`,
      }),
    ],
  });
};
