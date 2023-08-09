import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { PublishCommand, SNSClient } from "@aws-sdk/client-sns";
import { middyfy } from "@lib/middleware";
import cors from '@middy/http-cors';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const snsClient = new SNSClient({});

export default middyfy(async (event) => {
    const { name, email, newPassword } = event.body;
    const { id } = event.pathParameters;

    if (!name || name.length === 0 || !email || email.length === 0 || !newPassword || newPassword.length === 0) {
        return {
            statusCode: 422,
            body: JSON.stringify({
                error: {
                    title: "ValidatationError",
                    message: "required information is required"
                }
            })
        }
    }

    const command = new UpdateCommand({
        TableName: process.env.TABLE_NAME!,
        Key: {
            "pk": id,
            "sk": email
        },
        UpdateExpression: "set password = :newPassword",
        ExpressionAttributeValues: {
            ":newPassword": newPassword
        },
        ReturnValues: "ALL_NEW"
    });

    await snsClient.send(new PublishCommand({
        Message: "User Updated!",
        MessageAttributes: { // MessageAttributeMap
            eventType: { // MessageAttributeValue
                DataType: "String", // required
                StringValue: "USER_UPDATED",
            },
        },
        TopicArn: process.env.SNS_ARN!
    }))

    const response = await docClient.send(command);

    return {
        headers: {
            'Access-Control-Allow-Origin': '*',
            "Access-Control-Allow-Methods": "PUT"
        },
        statusCode: 200,
        body: "User Updated Successfully!"
    }
}).use(cors());