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
