import Discord from "discord.js";
import addMessageListener from "./helpers/addMessageListener";
import help from "./messages/helpMessageListener";
import memo from "./messages/memoMessageListener";
import randomPick from "./messages/randomMessageListener";

const main = (client: Discord.Client) => {
  addMessageListener(client, help);
  addMessageListener(client, memo);
  addMessageListener(client, randomPick);
};

export default main;
