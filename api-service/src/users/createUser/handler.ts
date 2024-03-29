import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { middyfy } from "@lib/middleware";
import cors from '@middy/http-cors';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PublishCommand, SNSClient } from "@aws-sdk/client-sns";
import { CognitoIdentityProviderClient, SignUpCommand } from "@aws-sdk/client-cognito-identity-provider"

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const snsClient = new SNSClient({});
const cognitoClient = new CognitoIdentityProviderClient({});

export default middyfy(async (event) => {
  const { name, email, password } = event.body;
  const command = new PutCommand({
    TableName: process.env.TABLE_NAME!,
    Item: {
      pk: name,
      sk: email,
      password: password
    },
  });

  const response = await docClient.send(command);

  await snsClient.send(new PublishCommand({
    Message: "User Created!",
    MessageAttributes: { // MessageAttributeMap
      eventType: { // MessageAttributeValue
        DataType: "String", // required
        StringValue: "USER_CREATED",
      },
    },
    TopicArn: process.env.SNS_ARN!
  }))

  const signupCommand = new SignUpCommand({
    ClientId: process.env.ClientPool_ID!,
    Username: name,
    Password: password,
  })

  await cognitoClient.send(signupCommand);

  return {
    headers: {
      'Access-Control-Allow-Origin': '*',
      "Access-Control-Allow-Methods": "POST"
    },
    statusCode: 201,
    body: JSON.stringify('User Created successfully!')
  }
}).use(cors());