import { MessageEmbed } from "discord.js";
import DiscordChannel from "../helpers/discordChannel";

// eslint-disable-next-line import/prefer-default-export
export const sendDebug = async (channel: DiscordChannel) => {
  await channel.send(
    new MessageEmbed({
      title: "LOCKCEPTRON",
      description: "test <@!253932693207646209>",
    })
  );
};
