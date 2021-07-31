import { MessageEmbed } from "discord.js";
import { whatsNew, helpDoc } from "../config";

import { MessageListener } from "../helpers/addMessageListener";

const help: MessageListener = (msg, message) => {
  if (message === "help") {
    msg.channel.send("Hi! I am lockceptron");
    msg.channel.send(
      new MessageEmbed({
        title: "LOCKCEPTRON",
        description: `[What's new?](${whatsNew})\n[Command DOCS](${helpDoc})`,
      })
    );
  }
};

export default help;
