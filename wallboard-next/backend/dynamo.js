const AWS = require("aws-sdk");

AWS.config.update({
  credentials: {
    accessKeyId: process.env.MTA_AWS_DYNAMO_ACCESS_KEY_ID,
    secretAccessKey: process.env.MTA_AWS_DYNAMO_SECRET_ACCESS_KEY,
  },
});

const dynamoDB = new AWS.DynamoDB({
  apiVersion: "2012-08-10",
  region: process.env.MTA_AWS_REGION,
});

module.exports = {
  getWallboardAuthToken: async ({ id, guid }) => {
    let params = {
      TableName: process.env.DYNAMO_DB_TABLE,
      Key: {
        WALLBOARD_GUID: { S: guid },
      },
    };

    return new Promise((resolve, reject) => {
      dynamoDB.getItem(params, (error, data) => {
        if (error) {
          reject(error);
        } else {
          console.log(data.Item);
          resolve(data.Item);
        }
      });
    });
  },
};
