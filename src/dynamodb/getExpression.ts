import { AttributeValue } from "@aws-sdk/client-dynamodb";
import { forEach } from "lodash";

const getExpression = (
  attributeMap: {
    [key: string]: AttributeValue | null;
  },
  type: "SET" | "ADD",
  prefix: string = ""
): {
  updateExpression: string;
  expressionAttributeValues: { [key: string]: AttributeValue };
} => {
  let idx = 0;
  let symbol: string = "";
  if (type === "SET") symbol = "=";
  if (type === "ADD") symbol = " ";

  const updateExpressions: string[] = [];
  const expressionAttributeValues: { [key: string]: AttributeValue } = {};
  forEach(attributeMap, (value, key) => {
    if (!value) return;
    const expressionValue = `:${prefix}${idx}`;
    updateExpressions.push(`${key}${symbol}${expressionValue}`);
    expressionAttributeValues[expressionValue] = value;
    idx += 1;
  });
  return {
    updateExpression: updateExpressions.join(", "),
    expressionAttributeValues,
  };
};

export default getExpression;
