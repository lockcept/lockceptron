import Discord from "discord.js";
import { chain, map } from "lodash";
import { fetchMembers, getUsersFromRole } from "./getUsersFromRole";

export const getUserId = (cmd: string): string | null => {
  const result = cmd.match(/^<@!([0-9]+)>$/i);
  if (!result) return null;
  return result[1];
};

export const getRoleId = (cmd: string): string | null => {
  const result = cmd.match(/^<@&([0-9]+)>$/i);
  if (!result) return null;
  return result[1];
};

export const getUsersFromIds = async (
  guild: Discord.Guild,
  userOrRoles: string[]
): Promise<string[]> => {
  await fetchMembers(guild);

  const userIdSet = await Promise.all(
    userOrRoles.map(async (userOrRole) => {
      if (getRoleId(userOrRole)) {
        const role = getRoleId(userOrRole);
        if (!role) return [];
        const users = await getUsersFromRole(guild, role);
        return map(users, (user) => user.id);
      }

      const userId = getUserId(userOrRole);
      return userId ? [userId] : [];
    })
  );

  const userIds = chain(userIdSet).flatten().compact().uniq().value();
  return userIds;
};
