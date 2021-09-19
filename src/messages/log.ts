import { MessageListener } from "../helpers/addMessageListener";
import logger from "../helpers/logger";

const log: MessageListener = (msg, message) => {
  logger.log(message, { guild: msg.guild?.id, user: msg.author.id });
};

export default log;
