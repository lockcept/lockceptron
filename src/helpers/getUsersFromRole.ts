import Discord from "discord.js";

export const fetchMembers = async (guild: Discord.Guild) => {
  await guild.members.fetch({ force: true });
};
export const getUsersFromRole = async (
  guild: Discord.Guild,
  role: string
): Promise<Discord.GuildMember[]> => {
  const fetchedRole = await guild.roles.fetch(role);
  if (!fetchedRole) return [];
  return fetchedRole.members.map((member) => member);
};
