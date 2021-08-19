import { stage } from "../config";

import { MessageListener } from "../helpers/addMessageListener";
import { sendDebug } from "../services/debugService";

const debug: MessageListener = async (msg, message) => {
  if (stage !== "dev") return;
  if (message === "debug") {
    sendDebug(msg);
  }
};

export default debug;
