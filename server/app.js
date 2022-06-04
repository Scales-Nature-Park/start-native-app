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
                console.log('Invalid.');
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
    console.log(req.files);

    try {
        let db = client.db('START-Project');
        let reptiles = db.collection('reptiles');
        
        // convert list of strings to JSON objects so that they can be queryable later
        // also make field names lowercase for case insensitive comparisons
        for (let i = 0; data.inputFields && i < data.inputFields.length; i++) {
            if (typeof data.inputFields[i] == 'string') data.inputFields[i] = JSON.parse(data.inputFields[i]);
            data.inputFields[i].name = data.inputFields[i].name.toLowerCase();
        }

        reptiles.insertOne(data).then((response) => {
            return res.status(200).send('');
        }).catch((err)   => {
            console.log(err);
            return res.status(400).send(err);
        });
    } catch(error) {
        console.log(error);
        return res.status(500).send(error);
    }
});

/**
 * Search endpoint that searches the reptiles collection in the
 * START-Project database for the values specified in the selections 
 * and states. 
 */
app.get('/search', (req, res) => {
    let params = req.query;
    if (!params) return res.status(500).send('Could not find valid criteria.');
    
    let queryObj = {};
    if (params.states) {
        // loop over all the states and append the conditions to the query object
        for (let state of params.states) {
            if (typeof state == 'string') state = JSON.parse(state);

            if (state.name.toString().toLowerCase().includes('lower bound')) {
                // make sure we have a valid number
                if (!state.value || state.value.toString().trim() == '' || isNaN(state.value)) continue;
                let name = state.name.toString().toLowerCase().trim().replace(' lower bound', '');
               
                // field is "name" and value is name string
                let currSubQuery = {$elemMatch: {name, value: {$gte : Number(state.value)}}};

                // add a condition to the query that the value of the element with the name must be >= state.value
                if (!queryObj.inputFields) queryObj.inputFields = {$all: [currSubQuery]};
                else queryObj.inputFields.$all = [...queryObj.inputFields.$all, currSubQuery];
                continue;
            } else if (state.name.toString().toLowerCase().includes('upper bound')) {
                // make sure we have a valid number
                if (!state.value || state.value.toString().trim() == '' || isNaN(state.value)) continue;
                let name = state.name.toString().toLowerCase().trim().replace(' upper bound', '');

                // field is "name" and value is name string
                let currSubQuery = {$elemMatch: {name, value: {$lte : Number(state.value)}}};

                // add a condition to the query that the value of the element with the name must be <= state.value
                if (!queryObj.inputFields) queryObj.inputFields = {$all: [currSubQuery]};
                else queryObj.inputFields.$all = [...queryObj.inputFields.$all, currSubQuery];
                continue;
            }
            
            // add a condition to the query that the value of the element in inputFields with the state name must 
            // be the same as the state value
            let currSubQuery = {$elemMatch: {name: state.name, value: state.value}};
            if (!queryObj.inputFields) queryObj.inputFields = {$all: [currSubQuery]};
            else queryObj.inputFields.$all = [...queryObj.inputFields.$all, currSubQuery];
        }
    }
    
    console.log(queryObj.inputFields.$all);
    
    // perform the find query using our query object from the above loop, 
    // otherwise empty and will return our entire collection
    try {
        let db = client.db('START-Project');
        let reptiles = db.collection('reptiles');
        
        reptiles.find(queryObj).toArray((err, searchRes) => {
            if (err) return res.status(400).send(err.message);
            
            console.log(searchRes);
            return res.status(200).send(searchRes);
        });
    } catch(error) {
        console.log(error);
        return res.status(500).send(error);
    }  
});

app.listen(port);
