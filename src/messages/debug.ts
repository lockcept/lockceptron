import { MessageEmbed } from "discord.js";
import { stage } from "../config";

import { MessageListener } from "../helpers/addMessageListener";

const debug: MessageListener = async (msg, message) => {
  if (stage !== "dev") return;
  if (message === "debug") {
    await msg.channel.send(
      new MessageEmbed({
        title: "LOCKCEPTRON",
        description: "test <@!253932693207646209>",
      })
    );
  }
};

export default debug;
