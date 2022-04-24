import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { AWS_CREDENTIAL } from "../environments";

const dynamoClient = new DynamoDBClient({
  credentials: {
    accessKeyId: AWS_CREDENTIAL.accessKeyId,
    secretAccessKey: AWS_CREDENTIAL.secretAccessKey,
  },
  region: "ap-northeast-2",
});

export default dynamoClient;
