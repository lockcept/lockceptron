import { STAGE } from "../environments";
import { MessageListener } from "../helpers/messageListener";
import { sendDebug } from "../services/debugService";

const debug: MessageListener = async (msg, message) => {
  if (STAGE !== "dev") return;
  if (message === "debug") {
    sendDebug(msg.channel);
  }
};

export default debug;
