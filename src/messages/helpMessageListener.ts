import { MessageEmbed } from "discord.js";
import { helpDoc } from "../config";
import { MessageListener } from "../helpers/addMessageListener";

const help: MessageListener = (msg, message) => {
  if (message === "help") {
    msg.channel.send("Hi! I am lockceptron");
    msg.channel.send(new MessageEmbed({ title: "What's new?", url: helpDoc }));
  }
};

export default help;
