import { get } from "lodash";

// type stages = 'prod' | 'dev';
export const stage = process.env.STAGE ?? "dev";

// eslint-disable-next-line import/prefer-default-export
const discordToken = {
  prod: "ODE1ODU3OTQxMzAyMzQ1NzQ5.YDyg6w.C-pk0TmB5uzc62d6ywGNvVLQmZE",
  dev: "ODIzNTQ3MDQ0NTI1ODk5Nzg2.YFiZ9A.NYDi1e7HPUoJXbjdaScMEhF4IrI",
};

export const discordTokenByStage: string = get(discordToken, stage);

const tableNames = {
  memo: "memo",
};

export const tableNameByStage = (tableName: keyof typeof tableNames) => {
  const table = get(tableNames, tableName);
  if (!table) throw Error("undefined table name");
  return `lockceptron-${stage}-${table}`;
};

export const credentials = {
  accessKeyId: "AKIAT6YAZPDA7TFRUTEP",
  secretAccessKey: "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",
};

export const helpDoc =
  "https://www.notion.so/lockceptron-What-s-new-10b051197d724702946d1ab353c6d9ce";
