import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { middyfy } from "@lib/middleware";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3"

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const s3Client = new S3Client({});

export default middyfy(async (event) => {
    const { id } = event.pathParameters;
    const command = new ScanCommand({
        TableName: process.env.TABLE_NAME!
    });

    const response = await docClient.send(command);

    const s3Command = new GetObjectCommand({
        Bucket: "api-service-pics-bucket",
        Key: "f5cecc17-c1cc-4c6c-9e89-f35c95934b00"
    })

    const s3Object = await (await s3Client.send(s3Command)).Body?.transformToString();

    return {
        headers: {
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET"
        },
        statusCode: 200,
        body: JSON.stringify({ s3: s3Object, db: response.Items })
    }
});