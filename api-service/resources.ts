import { readFileSync } from 'fs';

import yml from 'js-yaml';

const files = [
  readFileSync("./src/resources/dynamodb/ddb.yml"),
  readFileSync("./src/resources/cognito/userPool.yml"),
  readFileSync("./src/resources/s3/s3.yml"),
  readFileSync("./src/resources/cognito/identityPool.yml")
];

export default files.reduce((res, row) => {
  const data = yml.load(row);

  for (const [key, val] of Object.entries<any>(data)) {
    res[key] = { ...res[key], ...val }
  }

  return res;
}, {});