import { MessageListener } from "../helpers/messageListener";
import logger from "../helpers/logger";

const log: MessageListener = async (msg, message) => {
  logger.log(message, { guild: msg.guild?.id, user: msg.author.id });
};

export default log;
