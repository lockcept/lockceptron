import { MessageEmbed } from "discord.js";
import { DiscordChannel } from "../helpers/type";

// eslint-disable-next-line import/prefer-default-export
export const sendDebug = async (channel: DiscordChannel) => {
  await channel.send({
    embeds: [
      new MessageEmbed({
        title: "LOCKCEPTRON",
        description: "test <@!253932693207646209>",
      }),
    ],
  });
};
