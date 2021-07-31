import Discord from "discord.js";
import { map } from "lodash";
import addMessageListener from "./helpers/addMessageListener";
import help from "./messages/helpMessageListener";
import memo from "./messages/memoMessageListener";
import randomPick from "./messages/randomMessageListener";

const main = (client: Discord.Client) => {
  const messageListeners = [help, memo, randomPick];
  map(messageListeners, (messageListener) =>
    addMessageListener(client, messageListener)
  );
};

export default main;
