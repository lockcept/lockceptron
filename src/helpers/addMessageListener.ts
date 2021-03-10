import Discord from 'discord.js';

export type MessageListener = (_:Discord.Message) => void;

const addMessageListener = (client: Discord.Client, messageListener: MessageListener) => {
  client.on('message', messageListener);
};

export default addMessageListener;
