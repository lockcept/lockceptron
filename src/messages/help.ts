import { MessageEmbed } from "discord.js";
import { whatsNew, helpDoc } from "../config";

import { MessageListener } from "../helpers/messageListener";

const help: MessageListener = async (msg, message) => {
  if (message === "help") {
    msg.channel.send("Hi! I am lockceptron");
    msg.channel.send({
      embeds: [
        new MessageEmbed({
          title: "LOCKCEPTRON",
          description: `[What's new?](${whatsNew})\n[Command DOCS](${helpDoc})`,
        }),
      ],
    });
  }
};

export default help;
