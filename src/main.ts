import Discord from "discord.js";
import { map } from "lodash";
import addMessageListener from "./helpers/addMessageListener";
import boss from "./messages/boss";
import help from "./messages/help";
import memo from "./messages/memo";
import randomPick from "./messages/random";

const main = (client: Discord.Client) => {
  const messageListeners = [help, memo, randomPick, boss];
  map(messageListeners, (messageListener) =>
    addMessageListener(client, messageListener)
  );
};

export default main;
