const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-west-2' });

const docClient = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.TABLE_NAME;

exports.handler = async (event) => {
    try {
        let items = event.Records.map( (record) => {
            let jsonData = new Buffer(record.kinesis.data, 'base64').toString('ascii');
            console.log('Decoded record:', jsonData);
            
            let item = JSON.parse(jsonData);
            let putRequest = {
                PutRequest: {
                    Item: item
                }
            };
            return putRequest;
        });
        
        let params = {
            RequestItems: {
                [tableName]: items
            }
        };
        
        return await docClient.batchWrite(params).promise();
    } catch(err) {
        console.log("Error:", err);
        throw err;
    }
};