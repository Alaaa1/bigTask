export default async (event, context) => {
    event.Records.forEach(record => {
        const { body } = record;
        console.log(record.messageId);
        console.log(body);
    });
    return {};
};