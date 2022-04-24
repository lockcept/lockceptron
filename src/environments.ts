import "dotenv/config";

type STAGES = "prod" | "dev";
// type STAGES = 'prod' | 'dev';

export const STAGE = (process.env.STAGE ?? "dev") as STAGES;

// eslint-disable-next-line import/prefer-default-export
const DISCORD_TOKEN = {
  prod: process.env.DISCORD_TOKEN_PROD ?? "",
  dev: process.env.DISCORD_TOKEN_DEV ?? "",
};

export const DISCORD_TOKEN_BY_STAGE: string = DISCORD_TOKEN[STAGE];

export const AWS_CREDENTIAL = {
  accessKeyId: process.env.ACCESS_KEY_ID ?? "",
  secretAccessKey: process.env.SECRET_ACCESS_KEY ?? "",
};
