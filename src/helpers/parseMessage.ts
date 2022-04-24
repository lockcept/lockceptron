import { STAGE } from "../environments";

const parseMessage = (msg: string): string | null => {
  let command = "";
  if (STAGE === "prod") command = "tron";
  else if (STAGE === "dev") command = "tron-dev";

  if (msg.startsWith(`${command} `)) {
    return msg.substring(command.length + 1);
  }
  return null;
};

export default parseMessage;
