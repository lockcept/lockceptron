import Discord from "discord.js";
import { map } from "lodash";
import addMessageListener from "./helpers/addMessageListener";
import boss from "./messages/boss";
import debug from "./messages/debug";
import help from "./messages/help";
import log from "./messages/log";
import memo from "./messages/memo";
import randomPick from "./messages/random";

const main = (client: Discord.Client) => {
  const messageListeners = [log, help, memo, randomPick, boss, debug];
  map(messageListeners, (messageListener) =>
    addMessageListener(client, messageListener)
  );
};

export default main;
