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
        console.log("Connected successfully to server");
    } catch (e) {
        console.log(e.message);
    } 
}

DBConnect();

app.get('/signin', (req, res) => {
    const {email, password} = req.query;
    let db = client.db('START-Project');
    let credentials = db.collection('credentials');
    let results = credentials.find({"email": email, "password": password});
    
    try {
        results.toArray().then((response) => {
            if (response.length <= 0) {
                return res.status(500).send('Invalid credentials. Please verify you have entered the correct email and password.');
            }

            return res.status(200).send({});
        }).catch((err) => {
            console.log(err.message);
            return res.status(500).send(err.message);
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).send(error.message);
    }
});

app.post('/signup', (req, res) => {
    const {email, password} = req.query;
    let db = client.db('START-Project');
    let credentials = db.collection('credentials');
    let results = credentials.find({"email": email});
    
    try {
        results.toArray().then((response) => {
            if (response.length > 0) {
                console.log('Hello');
                throw 'An account already exists with this email. Try to login or use a different email.';
            }

            credentials.insertOne({
                "email": email,
                "password": password
            }).then((insertRes) => {
                console.log(insertRes);
                return res.status(200).send('Success');
            }).catch((insertError) => {
                console.log(insertError);
                return res.status(500).send(insertError);
            });
        }).catch((err) => {
            console.log(err);
            return res.status(500).send(err);
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
});

app.listen(port);
