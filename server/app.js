'use strict'

// Express App (Routes)
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());

// DB client
const {MongoClient} = require('mongodb');
const uri = process.env.MONGODB;
const client = new MongoClient(uri);

const bodyParser = require('body-parser');
const path = require('path');
const port = process.env.PORT || 5000;

async function DBConnect() {
    try {
        await client.connect();    
        await client.db("admin").command({ ping: 1 });
        console.log("Connected successfully to server");
    } catch (e) {
        console.log(e.message);
    } finally {
        await client.close();
    }
}

DBConnect();

app.get('/account', (req, res) => {
    const {email, password} = req.query;
    console.log('email: ' + email + ' Password: ' + password);
    res.status(200).send({});
});

app.listen(port);
