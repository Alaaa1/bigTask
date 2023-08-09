// import { middyfy } from "@lib/middleware";
// import { S3Client } from "@aws-sdk/client-s3";
// import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
// import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";
// import { CognitoIdentityProvider } from "@aws-sdk/client-cognito-identity-provider"


// const cognitoClient = new CognitoIdentityProvider({});
// const client = new DynamoDBClient({});
// const docClient = DynamoDBDocumentClient.from(client);
// export default async (event, context) => {
//     console.log("Alaa stuff", event.requestParameters)
//     console.log("Alaa stuff", event.requestElements)
//     console.log("Alaa context", context)
//     console.log("Alaa event", event.Records[0].s3)
//     console.log("Alaa identity", event.userIdentity)
//     const key = event.Records[0].s3.object.key;
//     const command = new UpdateCommand({
//         TableName: process.env.TABLE_NAME!,
//         Key: {
//             "pk": "alaa",
//             "sk": "alaa0602@hotmail.com"
//         },
//         UpdateExpression: "set pfpKey = :pfpKey",
//         ExpressionAttributeValues: {
//             ":pfpKey": key
//         },
//         ReturnValues: "ALL_NEW"
//     });

//     // const command = new PutObjectCommand({
//     //     Bucket: "api-service-pics-bucket",
//     //     Key: context.awsRequestId,
//     //     // Key: context.identity.cognitoIdentityId,
//     //     Body: "Hello S3!",
//     // });

//     const response = await client.send(command);
//     // console.log(response);

//     return {
//         statusCode: 201,
//         body: "Profile Picture Key Added to DB!"
//     }
// };