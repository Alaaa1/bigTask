import { middyfy } from "@lib/middleware";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const client = new S3Client({});
export default middyfy(async (event, context) => {

    const command = new PutObjectCommand({
        Bucket: "api-service-pics-bucket",
        Key: context.awsRequestId,
        // Key: context.identity.cognitoIdentityId,
        Body: "Hello S3!",
    });

    const response = await client.send(command);
    console.log(response);

    return {
        statusCode: 201,
        body: "Profile Picture Updated Successfully"
    }
});