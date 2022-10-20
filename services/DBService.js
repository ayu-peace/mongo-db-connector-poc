// const {MongoClient} = require('mongodb');

// async function listDatabases(client){
//   databasesList = await client.db().admin().listDatabases();

//   console.log("Databases:");
//   databasesList.databases.forEach(db => {
//     console.log(` - ${db.name}`)
//   });
//   // const result = await client.db("DBTest").collection("Folders").insertOne({
//   //   fId: '11',
//   //   pId: '00'
//   // });
//   // console.log(`New listing created with the following id: ${result.insertedId}`);
// };

// async function connectToDB(){
//   const uri = "mongodb+srv://ayu123:ayu123@ayucluster.b4kwafp.mongodb.net/test";
//   const client = new MongoClient(uri);

//   try {
//       // Connect to the MongoDB cluster
//       await client.connect();
//       await listDatabases(client);
//       const db = await client.db("DBTest").collection("Folders")
//       // const folders = await db.find({});
//       const res = await db.insertOne({fId: '123', pId: '321'});
//       console.log('inserting', res);
//       return db;
//       // return client;
//       // Make the appropriate DB calls
//       // await  listDatabases(client);

//   } catch (e) {
//       console.error(e);
//   }
// }
const client = null;
async function getCollection(client) {
  return client;
  // return await client.db("DBTest").collection("Folders");
}

// const client = await connectToDB().catch(console.error);
// const db = await client.db("DBTest").collection("Folders");

exports.getAllFolders = async (req) => {
  console.log('Finding in DB');
  console.log('DB', req.app.locals.db);
  const db = req.app.locals.db;
  // const db = getCollection(client);
  return await db.find({});
};

exports.createFolder = async (req, folder) => {
  console.log('Inserting in DB', folder);
  console.log('DB', app.locals.db);
  const db = req.app.locals.db;
  // const db = getCollection(client);
  return await db.insertOne(folder);
};

exports.getFoldersById = async (id) => {
  conole.log('Finding by id', id);
  const db = getCollection(client);
  return await db.findOne({ _id: id })
};

exports.updateFolders = async (id, blog) => {
  console.log('Updating folder', id, blog);
  const db = getCollection(client);
  return await db.findByIdAndUpdate(id, blog);
};

exports.deleteFolders = async (id) => {
  const db = getCollection(client);
  return await db.deleteOne( { "_id" : ObjectId(id) } );
};

exports.deleteAllFolders = async () => {
  const db = getCollection(client);
  return await db.deleteMany({"fId": "11"});
}
