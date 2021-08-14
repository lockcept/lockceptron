const escapeDiscord = (str: string): string => {
  return str.replace("_", "\\_");
};

export default escapeDiscord;
