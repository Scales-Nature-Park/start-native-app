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

/**
 * Async function that attempts connecting to the database.
 */
async function DBConnect() {
    try {
        await client.connect();    
        console.log("Connected successfully to server");
    } catch (e) {
        console.log(e.message);
    } 
}

DBConnect();

/**
 * Login endpoint that authenticates passed credentials
 * with existing documents in the database and sends 
 * a success response if they exist.
 */
app.get('/signin', (req, res) => {
    const {email, password} = req.query;

    try {
        // search the credentials collection in the START-Project
        // database for the passed email and password
        let db = client.db('START-Project');
        let credentials = db.collection('credentials');
        let results = credentials.find({"email": email, "password": password});
        
        // retrieve the array of the account and respond with the id
        results.toArray().then((response) => {
            if (response.length <= 0) {
                return res.status(500).send('Invalid credentials. Please verify you have entered the correct email and password.');
            }

            return res.status(200).send(response[0]._id);
        }).catch((err) => {
            console.log(err.message);
            return res.status(500).send(err.message);
        });
    } catch (error) {
        console.log(error.message);
        return res.status(400).send(error.message);
    }
});

/**
 * Signup endpoint that authenticates passed credentials
 * with existing documents in the database and sends 
 * a fail response if they exist, create a new document for
 * them otherwise.
 */
app.post('/signup', (req, res) => {
    const {email, password} = req.query;
    
    try {
        // search the credentials collection in the START-Project
        // database for the passed email and password
        let db = client.db('START-Project');
        let credentials = db.collection('credentials');
        let results = credentials.find({"email": email});

        // retrieve the array of the account and respond with the fail
        // if it has any elements
        results.toArray().then((response) => {
            if (response.length > 0) {
                throw 'An account already exists with this email. Try to login or use a different email.';
            }
            
            // insert a new document with the email and password
            credentials.insertOne({
                "email": email,
                "password": password
            }).then((insertRes) => {
                return res.status(200).send('');
            }).catch((insertError) => {
                console.log(insertError);
                return res.status(500).send(insertError);
            });
        }).catch((err) => {
            console.log(err);
            return res.status(400).send(err);
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
});

/**
 * Data Entry endpoint that sends in passed data to the reptiles
 * collection in the START-Project database. Returns a success or fail
 * based on the database response.
 */
app.post('/dataEntry', (req, res) => {
    const data = req.query;
    if (!data) return res.status(400).send('Failed to retrieve entered data.');

    try {
        let db = client.db('START-Project');
        let reptiles = db.collection('reptiles');

        reptiles.insertOne(data).then((response) => {
            return res.status(200).send('');
        }).catch((err) => {
            console.log(err);
            return res.status(400).send(err);
        });
    } catch(error) {
        console.log(error);
        return res.status(500).send(error);
    }
});

app.listen(port);
