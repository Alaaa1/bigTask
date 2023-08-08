import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DeleteCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { middyfy } from "@lib/middleware";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export default middyfy(async (event) => {
    const { name, email } = event.body;

    if (!name || name.length === 0 || !email || email.length === 0) {
        return {
            statusCode: 422,
            body: JSON.stringify({
                error: {
                    title: "ValidatationError",
                    message: "missing required information"
                }
            })
        }
    }
    console.log({ event });

    const command = new DeleteCommand({
        TableName: process.env.TABLE_NAME!,
        Key: {
            "pk": name,
            "sk": email
        }
    });

    const response = await docClient.send(command);

    return {
        statusCode: 200,
        body: "User Deleted Successfully!"
    }
});