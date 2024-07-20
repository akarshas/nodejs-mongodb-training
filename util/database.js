const { MongoClient, ServerApiVersion } = require('mongodb');

const uri =
  'mongodb+srv://akarshas:akarshas@shoppingcart.97lz4cr.mongodb.net/?retryWrites=true&w=majority&appName=shoppingcart';

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let db = null;
const connect = async () => {
  await client.connect();
  db = await client.db('shop');
  return db;
};

const getDb = () => {
  return db;
};

module.exports = {
  connect: connect,
  getDb: getDb,
};
