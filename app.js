const express = require("express");
const Folder = require("./models/Folders");

const app = express();

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
var MongoClient = require('mongodb').MongoClient;
var db;


// Initialize connection once
const uri = "mongodb://ayu123:ayu123@dedicatedazurecali1.99bvq.mongodb.net:27017/test";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true});
// MongoClient.connect("mongodb+srv://ayu123:ayu123@cluster0.daagny6.mongodb.net/test", function(err, client) {
client.connect(err => {
  if(err) throw err;
  db = client.db('DBTest');
  //executing queries to know times
  getAllChildren();
  getAllParents();
  getFolder();

// Start the application after the database connection is ready
  app.listen(3000);
  console.log("Listening on port 3001");
});

const createFolderTree = async (root, currentDepth, maxDepth) => {
  if(!root || !root.foldId) return;
  if(currentDepth >= maxDepth) return;

  const folders = db.collection('Folders');
  const parentId = root.foldId;
  const newDepth = currentDepth + 1;
  const child1 = new Folder(parentId + '-1', parentId, newDepth, 'allowed');
  const child2 = new Folder(parentId + '-2', parentId, newDepth, 'allowed');
  const insertResp = await folders.insertMany([
    child1.getFolderObj(),
    child2.getFolderObj()
  ]);
  console.log('Added ' + insertResp.insertedCount + ' folders. :: ' + child1.foldId + ' and ' + child2.foldId);
  createFolderTree(child1, newDepth, maxDepth);
  createFolderTree(child2, newDepth, maxDepth);
}

// Reuse database object in request handlers

// Get single folder by Id
let getFolderTT = 0;
let getFolderMT = 10000000;
let getFolderC = 0;
app.get("/folder", async function(req, res) {
  const folders = db.collection('Folders');
  const foldId = req.body.foldId;
  const startTime = Date.now();
  const folderResp = await folders.findOne({foldId: foldId});
  const endTime = Date.now();
  // console.log("Folder info:", folderResp);
  console.log("Get /folder by id resp time: " + (endTime - startTime));
  const tempObj = getTimeStamps(getFolderTT, (endTime - startTime), getFolderMT);
  getFolderTT = tempObj.totalTime;
  getFolderMT = tempObj.minTime;
  getFolderC++;
  res.send(folderResp);
});

// Get all child folders via top down traversal
let getChildrenTT = 0;
let getChildrenMT = 10000000;
let getChildrenC = 0;
app.get("/children", async function(req, res) {
  const startTime = Date.now();
  const respAggTopDown = db.collection('Folders').aggregate( [
    { "$match": { "foldId": "1" } },
    {
       $graphLookup: {
          from: "Folders",
          "startWith": "$foldId",
          connectFromField: "foldId",
          connectToField: "parentId",
          "as": "children",
          restrictSearchWithMatch: {access: 'allowed'}
        }
    },
    ]);
    for await (const doc of respAggTopDown) {
      // console.log(doc);
    }
  const endTime = Date.now();
  console.log("Get /children resp time: " + (endTime - startTime));
  const tempObj = getTimeStamps(getChildrenTT, (endTime - startTime), getChildrenMT);
  getChildrenTT = tempObj.totalTime;
  getChildrenMT = tempObj.minTime;
  getChildrenC++;
  res.send(respAggTopDown);
});

//Get all parents till root via bottom up traversal
let getParentsTT = 0;
let getParentsMT = 10000000;
let getParentsC = 0;
app.get("/parents", async function(req, res) {
  const startTime = Date.now();
  const respAggBottomUp = db.collection('Folders').aggregate( [
    {
       $graphLookup: {
          from: "Folders",
          "startWith": "$parentId",
          connectFromField: "parentId",
          connectToField: "foldId",
          "as": "parents",
          restrictSearchWithMatch: {access: 'allowed'}
        }
      },
      { "$match": { "foldId": "1.1.1.1.2" }},
    ]);

  for await (const doc of respAggBottomUp) {
    console.log(doc);
  }
  const endTime = Date.now();
  console.log("Get /parents resp time: " + (endTime - startTime));
  const tempObj = getTimeStamps(getParentsTT, (endTime - startTime), getParentsMT);
  getParentsTT = tempObj.totalTime;
  getParentsMT = tempObj.minTime;
  getParentsC++;
  res.send(respAggBottomUp);
});

// Add a new folder to current node by Id
let postAddFoldersTT = 0;
let postAddFoldersMT = 10000000;
let postAddFoldersC = 0;
app.post("/addFolder", async function(req, res) {
  const parentId = req.body.parentId;

  const newFolder = new Folder((Math.random() * 1000000).toFixed(), parentId, 0, 'allowed');
  const startTime = Date.now();
  const insertResp = await db.collection('Folders').insertOne(newFolder.getFolderObj());
  const endTime = Date.now();
  // console.log(`${insertResp.insertedCount} documents were inserted.`);
  console.log("Post /addFolder resp time: " + (endTime - startTime));
  const tempObj = getTimeStamps(postAddFoldersTT, (endTime - startTime), postAddFoldersMT);
  postAddFoldersTT = tempObj.totalTime;
  postAddFoldersMT = tempObj.minTime;
  postAddFoldersC++;
  res.send(insertResp);;
});

// Update a folder by Id
let putFoldersTT = 0;
let putFoldersMT = 10000000;
let putFoldersC = 0;
app.put("/folder", async function(req, res) {
  const foldId = req.body.foldId;
  const newAccessState = req.body.access;
  const startTime = Date.now();
  const folderDB = db.collection('Folders');
  const updatedFolder = await folderDB.updateOne({foldId: foldId}, {$set: {access: newAccessState}});
  const endTime = Date.now();
  // console.log(`documents were updated.`);
  console.log("Update /folder by id resp time: " + (endTime - startTime));
  const tempObj = getTimeStamps(putFoldersTT, (endTime - startTime), putFoldersMT);
  putFoldersTT = tempObj.totalTime;
  putFoldersMT = tempObj.minTime;
  putFoldersC++;
  res.send(updatedFolder);
});

// Utility endpoints
////////////////////

app.delete("/", async function(req, res) {
  const folders = db.collection('Folders');
  const deleteResp = await folders.deleteMany({});
  console.log("DeleteResp:",deleteResp.deletedCount);
  res.send(deleteResp);
});

app.post("/createTree", async function(req, res) {
  const folders = db.collection('Folders');
  const maxDepth = req.body.maxDepth;
  const currentDepth = 0;
  const root = new Folder('1', '0', currentDepth, 'allowed');
  const insertResp = await folders.insertOne(root.getFolderObj());
  console.log('Added ' + insertResp.insertedCount + ' root folders :: ' + root.foldId);
  createFolderTree(root, currentDepth, maxDepth);
  res.send(insertResp);
});

app.get("/timestamps", async function(req, res) {
  console.log("Timestamps");
  console.log("getFolderTT", (getFolderTT/getFolderC), getFolderMT);
  console.log("getChildrenTT", (getChildrenTT/getChildrenC), getChildrenMT);
  console.log("getParentsTT", (getParentsTT/getParentsC), getParentsMT);
  console.log("postAddFoldersTT", (postAddFoldersTT/postAddFoldersC), postAddFoldersMT);
  console.log("putFoldersTT", (putFoldersTT/putFoldersC), putFoldersMT);
  res.send("Success");
});

const getTimeStamps = (totalTime, currentTime, minTime) => {
  return {
    totalTime: totalTime + currentTime,
    minTime: (currentTime < minTime) ? currentTime : minTime
  }
};

const getAllChildren = async () => {
  const startTime = Date.now();
  const respAggTopDown = db.collection('Folders').aggregate( [
    { "$match": { "foldId": "1" } },
    {
       $graphLookup: {
          from: "Folders",
          "startWith": "$foldId",
          connectFromField: "foldId",
          connectToField: "parentId",
          "as": "children",
          restrictSearchWithMatch: {access: 'allowed'}
        }
    },
    ]);
    for await (const doc of respAggTopDown) {
      console.log(doc);
    }
  const endTime = Date.now();
  console.log("Get /children resp time: " + (endTime - startTime));
}

const getAllParents = async () => {
  const startTime = Date.now();
  const respAggBottomUp = db.collection('Folders').aggregate( [
    {
       $graphLookup: {
          from: "Folders",
          "startWith": "$parentId",
          connectFromField: "parentId",
          connectToField: "foldId",
          "as": "parents",
          restrictSearchWithMatch: {access: 'allowed'}
        }
      },
      { "$match": { "foldId": "1.1.1.1.2" }},
    ]);

  for await (const doc of respAggBottomUp) {
    console.log(doc);
  }
  const endTime = Date.now();
  console.log("Get /parents resp time: " + (endTime - startTime));
}

const getFolder = async () => {
  const folders = db.collection('Folders');
  const foldId = "1-1-1-1-1-1-1";
  const startTime = Date.now();
  const folderResp = await folders.findOne({foldId: foldId});
  const endTime = Date.now();
  console.log("Folder info:", folderResp);
  console.log("Get /folder by id resp time: " + (endTime - startTime));
}

module.exports = app;
