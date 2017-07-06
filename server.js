const fs = require("fs");
const assert = require("assert");
const express = require("express");
const MongoClient = require("mongodb").MongoClient;


const app = express();
const hostname = 'localhost';
const port = '8001';

app.use(express.static('public'));

app.get('/', (req, res) => {
    const client = __dirname + '/src/index.html';
    res.sendFile(client);
});

app.get('/data/:collection', (req, res) => {
    const query = req.params.collection;
    console.log(query);
    mongoFind(query, (result) => {
        res.send(result);
    });
});

function mongoFind(query, callback) {
    const url = `mongodb://${hostname}:27017/prices`;
    MongoClient.connect(url, (err, db) => {
        assert.equal(null, err);
        findDocuments(db, query, (result) => {
            callback(result);
            db.close();
        });
    });
};

function findDocuments(db, query, callback) {
    const collection = db.collection(query);
    collection.find({}).toArray((err, docs) => {
        assert.equal(null, err);
        callback(docs)
    });
};

app.listen(port, hostname, () => {
    console.log(`Listening on ${hostname}:${port}`)
});
