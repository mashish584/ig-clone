/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */

const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

const env = process.env.ENV;
const AppSyncId = process.env.API_INSTAGRAM_GRAPHQLAPIIDOUTPUT;
const TableName = `User-${AppSyncId}-${env}`;

const userExists = async id => {
  const params = {
    TableName,
    Key: id,
  };
  try {
    const response = await docClient.get(params).promise();
    return !!response?.item;
  } catch (error) {
    return false;
  }
};

const saveUser = async user => {
  const date = new Date();
  const timestamp = date.getTime();
  const dateString = date.toISOString();
  const Item = {
    ...user,
    createdAt: dateString,
    updatedAt: dateString,
    __typename: 'User',
    __lastChangedAt: timestamp,
    __version: 1,
  };
  const params = {
    TableName,
    Item,
  };

  try {
    await docClient.put(params).promise();
  } catch (error) {
    console.log({error});
  }
};

exports.handler = async (event, context) => {
  console.log('Hi, Lambda trigger works.');
  console.log(event);

  if (!event.request?.userAttributes) {
    console.log(`No user data available.`);
    return;
  }

  const userAttributes = event.request.userAttributes; // {sub,email,name}
  const newUser = {
    id: userAttributes.sub,
    name: userAttributes.name,
    email: userAttributes.email,
  };

  // check if user already exist
  if (!(await userExists(newUser.id))) {
    await saveUser(newUser);
    console.log(`User ${newUser.id} saved.`);
  } else {
    console.log(`User ${newUser.id} already exist.`);
  }

  // if not, save the user to database

  return event;
};
