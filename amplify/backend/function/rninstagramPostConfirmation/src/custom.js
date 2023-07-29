/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
const AWS = require('aws-sdk');
const documentClient = new AWS.DynamoDB.DocumentClient();

const env = process.env.ENV;
const appSyncID = process.env.API_RNINSTAGRAM_GRAPHQLAPIIDOUTPUT;
const TableName = `User-${appSyncID}-${env}`;

const isUserExist = async id => {
  try {
    const params = {
      TableName,
      Key: id,
    };

    const response = await documentClient.get(params).promise();
    return !!response?.Item;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const saveUser = async user => {
  try {
    const date = new Date();
    const dateString = date.toISOString();
    const timestamp = date.getTime();

    const Item = {
      ...user,
      __typename: 'User',
      createdAt: dateString,
      updatedAt: dateString,
      _lastChangedAt: timestamp,
      _version: 1,
    };

    const params = {
      TableName,
      Item,
    };

    await documentClient.put(params).promise();
  } catch (e) {
    console.log(e);
  }
};

exports.handler = async (event, context) => {
  if (!event?.request?.userAttributes) {
    console.log('No user data available');
    return;
  }

  const userAttributes = event.request.userAttributes;

  const newUser = {
    id: userAttributes.sub,
    name: userAttributes.name,
    email: userAttributes.email,
  };

  // check if user already exist
  if (!isUserExist(newUser.id)) {
    // if not, save the user to database
    await saveUser(newUser);
    console.log(`User ${newUser.id} already exist`);
  } else {
    console.log(`User ${newUser.id} already exist`);
  }

  return event;
};
