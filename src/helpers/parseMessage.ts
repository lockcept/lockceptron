import { stage } from "../config";

const parseMessage = (msg: string): string | null => {
  let command = "";
  if (stage === "prod") command = "tron";
  else if (stage === "dev") command = "tron-dev";

  if (msg.startsWith(command)) {
    return msg.substring(command.length + 1);
  }
  return null;
};

export default parseMessage;
