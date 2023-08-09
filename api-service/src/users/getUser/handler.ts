import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { middyfy } from "@lib/middleware";
import cors from '@middy/http-cors';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export default middyfy(async (event) => {
    const { id } = event.pathParameters;
    console.log(id);
    const command = new QueryCommand({
        TableName: process.env.TABLE_NAME!,
        KeyConditionExpression:
            "pk = :id",
        ExpressionAttributeValues: {
            ":id": id,
        },
        ConsistentRead: true,
    });

    const response = await docClient.send(command);

    // const s3Command = new GetObjectCommand({
    //     Bucket: "api-service-pics-bucket",
    //     Key: "private/us-east-1:e6fc63f5-9605-4c41-9b7b-182cbcef0e71/cdac7ac3-125f-45cc-aa98-4e53f713064c"
    // })

    // const s3Object = await (await s3Client.send(s3Command)).Body?.transformToString();

    return {
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET"
        },
        statusCode: 200,
        body: JSON.stringify({ /*s3: s3Object,*/ db: response.Items })
    }
}).use(cors());