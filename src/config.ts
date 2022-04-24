import { STAGE } from "./environments";

const tableNames = {
  memo: "memo",
  boss: "boss",
};

export const tableNameByStage = (tableName: keyof typeof tableNames) => {
  const table = tableNames[tableName];
  if (!table) throw Error("undefined table name");
  return `lockceptron-${STAGE}-${table}`;
};

export const whatsNew =
  "https://www.notion.so/lockceptron-What-s-new-10b051197d724702946d1ab353c6d9ce";

export const helpDoc =
  "https://www.notion.so/lockceptron-DOCS-acd2449103174c0abd8b0a0083a17d89";
