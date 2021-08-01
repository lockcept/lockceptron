import { AttributeValue } from "@aws-sdk/client-dynamodb";
import { forEach } from "lodash";

const getExpression = (attributeMap: {
  [key: string]: AttributeValue | null;
}): {
  updateExpression: string;
  expressionAttributeValues: { [key: string]: AttributeValue };
} => {
  let idx = 0;
  const updateExpressions: string[] = [];
  const expressionAttributeValues: { [key: string]: AttributeValue } = {};
  forEach(attributeMap, (value, key) => {
    if (!value) return;
    updateExpressions.push(`${key}=:${idx}`);
    expressionAttributeValues[`:${idx}`] = value;
    idx += 1;
  });
  return {
    updateExpression: updateExpressions.join(", "),
    expressionAttributeValues,
  };
};

export default getExpression;
