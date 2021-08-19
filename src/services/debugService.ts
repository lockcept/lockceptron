import Discord, { MessageEmbed } from "discord.js";

// eslint-disable-next-line import/prefer-default-export
export const sendDebug = async (msg: Discord.Message) => {
  await msg.channel.send(
    new MessageEmbed({
      title: "LOCKCEPTRON",
      description: "test <@!253932693207646209>",
    })
  );
};
