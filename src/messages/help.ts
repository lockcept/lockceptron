import { MessageListener } from "../helpers/messageListener";
import { sendHelp } from "../services/helpService";

const help: MessageListener = async (msg, message) => {
  if (message === "help") {
    sendHelp(msg.channel);
  }
};

export default help;
