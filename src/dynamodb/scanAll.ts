import {
  AttributeValue,
  ScanCommand,
  ScanCommandInput,
} from "@aws-sdk/client-dynamodb";
import dynamoClient from ".";

const scanAll = async (
  scanInput: ScanCommandInput
): Promise<
  {
    [key: string]: AttributeValue;
  }[]
> => {
  const command = new ScanCommand(scanInput);
  const output = await dynamoClient.send(command);
  if (!output.Items) return [];
  if (!output.LastEvaluatedKey) return output.Items;

  const nextItems = await scanAll({
    ...scanInput,
    ExclusiveStartKey: output.LastEvaluatedKey,
  });

  return [...output.Items, ...nextItems];
};

export default scanAll;
