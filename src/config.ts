import { get } from "lodash";

// type stages = 'prod' | 'dev';
export const stage = process.env.STAGE ?? "dev";

// eslint-disable-next-line import/prefer-default-export
const discordToken = {
  prod: process.env.DISCORD_TOKEN_PROD,
  dev: process.env.DISCORD_TOKEN_DEV,
};

export const discordTokenByStage: string = get(discordToken, stage);

const tableNames = {
  memo: "memo",
  boss: "boss",
};

export const tableNameByStage = (tableName: keyof typeof tableNames) => {
  const table = get(tableNames, tableName);
  if (!table) throw Error("undefined table name");
  return `lockceptron-${stage}-${table}`;
};

export const credentials = {
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
};

export const whatsNew =
  "https://www.notion.so/lockceptron-What-s-new-10b051197d724702946d1ab353c6d9ce";

export const helpDoc =
  "https://www.notion.so/lockceptron-DOCS-acd2449103174c0abd8b0a0083a17d89";
