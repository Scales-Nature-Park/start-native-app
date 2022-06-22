'use strict'

// Express App (Routes)
const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');
const sanitize = require('mongo-sanitize');
const fileUpload = require('express-fileupload');

const app = express();

app.use(cors());
app.use(fileUpload());

// DB client
const { MongoClient } = require('mongodb');
const { ObjectID } = require('bson');
const uri = process.env.MONGODB;
const client = new MongoClient(uri);
const port = process.env.PORT || 5000;

// write pid to a file to help keep track of server process
fs.writeFile("../ExternalAssets/scripts/server.txt", process.pid.toString(), (err) => {
    if (err) return console.log(err);
}); 

/**
 * Async function that attempts connecting to the database.
 */
async function DBConnect() {
    try {
        await client.connect();    
        console.log("Connected successfully to database");
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
    if (!req.query || !req.query.username || !req.query.password)
    return res.status(400).send('Invalid credentials. Please verify you have entered the correct username and password.');
    
    const username = sanitize(req.query.username);
    const password = sanitize(req.query.password);

    try {
        // search the credentials collection in the START-Project
        // database for the passed username and password
        let db = client.db('START-Project');
        let credentials = db.collection('credentials');
        let results = credentials.find({"username": username, "password": password});
        
        // retrieve the array of the account and respond with the id
        results.toArray().then((response) => {
            if (response.length <= 0) 
            return res.status(500).send('Invalid credentials. Please verify you have entered the correct username and password.');

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
 * Admin login endpoint that authenticates passed in credentials
 * with existing documents in the database and sends 
 * a success response if they exist.
 */
 app.get('/admin-signin', (req, res) => {
    if (!req.query || !req.query.username || !req.query.password)
    return res.status(400).send('Invalid credentials. Please verify you have entered the correct username and password.');
    
    const username = sanitize(req.query.username);
    const password = sanitize(req.query.password);

    try {
        // search the credentials collection in the START-Project
        // database for the passed username and password
        let db = client.db('START-Project');
        let credentials = db.collection('admin-credentials');
        let results = credentials.find({"username": username, "password": password});
        
        // retrieve the array of the account and respond with the id
        results.toArray().then((response) => {
            if (response.length <= 0) 
            return res.status(500).send('Invalid credentials. Please verify you have entered the correct username and password.');

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
    if (!req.query || !req.query.username || !req.query.password)
    return res.status(400).send('Username and password were not sent to the server.');

    const username = sanitize(req.query.username);
    const password = sanitize(req.query.password);
    
    try {
        // search the credentials collection in the START-Project
        // database for the passed username and password
        let db = client.db('START-Project');
        let credentials = db.collection('credentials');
        let results = credentials.find({"username": username});

        // retrieve the array of the account and respond with the fail
        // if it has any elements
        results.toArray().then((response) => {
            if (response.length > 0) {
                throw 'An account already exists with this username. Try to login or use a different username.';
            }
            
            // insert a new document with the username and password
            credentials.insertOne({
                "username": username,
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
        return res.status(500).send(error);
    }
});

/**
 * Username endpoint that retrieves the username of an account 
 * in the database with the same ID as the passed in userId parameter.
 * It responds with the username if the database query is successful, or an 
 * error otherwise. 
 */
app.get('/username/:userId', (req, res) => {
    const params = req.params;
    if(!params.userId) return res.status(404).send('No user ID was sepcified.');
    
    try {
        // load the credentials collection from the START-Project db
        let db = client.db('START-Project');
        let credentials = db.collection('credentials');

        // search for a credentials document using the passed in userid
        credentials.find({_id: ObjectID(params.userId)}).toArray((err, searchRes) => {
            if (err) return res.status(400).send(err.message);
            
            if (searchRes.length == 0) return res.status(404).send('Could not find a user with the specified ID.');
            else return res.status(200).send(searchRes[0].username);
        });
    } catch(err) {
        console.log(err);
        res.status(500).send(err);
    }
});

/**
 * Password update endpoint that verifies the passed in credentials
 * for the account with the passed in userid parameter, then 
 * it updates the password of that account if the credentials are valid.
 * It responds with a success message or an error message if any of the
 * queries failed.
 */
app.put('/password/:userid', (req, res) => {
    const params = {...req.params, ...req.query};
    if (!params.userid || !params.currentPassword || !params.newPassword)
    return res.status(404).send('Failed to retrieve your user information.');

    try {
        // load the credentials collection from the START-Project db
        let db = client.db('START-Project');
        let credentials = db.collection('credentials');

        // search for a credentials document using the passed in userid
        credentials.find({_id: ObjectID(params.userid)}).toArray((err, searchRes) => {
            if (err) return res.status(400).send(err.message);
            if (searchRes.length == 0) return res.status(404).send('Could not find a user with the specified ID.');
            if (searchRes[0].password !== params.currentPassword) return res.status(403).send('Invalid current password.');
        });
        
        // update the password now that we know the credentials are valid
        credentials.updateOne({_id: ObjectID(params.userid)}, 
        {
            $set: {
                password: params.newPassword
            }
        }, (err, response) => {
            if (err) return res.status(400).send(err.message);
            return res.status(200).send('Successful update.');
        });
    } catch(err) {
        res.status(500).send(err);
    }
});


/**
 * Delete user endpoint that takes in a userid parameter and 
 * deletes the matching account document from the credentials collection
 * in our START-Project database. Returns a success message or an error
 * message if the query fails or a user id isn't provided 
 */
app.delete('/user/:userid', (req, res) => {
    const params = req.params;
    if (!params.userid) return res.status(400).send('Failed to retrieve your user information');

    try {
        // load the credentials collection from the START-Project db
        let db = client.db('START-Project');
        let credentials = db.collection('credentials');
        
        // delete the first document that matches the passed in id (there is only 1)
        credentials.deleteOne({_id: ObjectID(params.userid)}, (err, response) => {
            if (err) return res.status(400).send(err.message);
            if (!response?.deletedCount) return res.status(500).send('Could not perform delete operation. Please try again at a later time.');
            return res.status(200).send('Successfully deleted your account.');
        });
    } catch (error) {
        res.status(500).send(err);
    }
});

/**
 * Image Upload endpoint that stores a passed in image from the request into
 * the database and responds with the ObjectID.
 */
app.post('/imageUpload', async (req, res) => {
    if(!req.files) return res.status(400).send('No files were uploaded.');

    try {
        const image = req.files.photo;

        if (!image) {
            return res.status(400).send('Please enter an icon url.');
        }

        // store our image in the uploads folder on our server
        image.mv('uploads/' + image.name, (err) => {
            if(err) return res.status(500).send(err);
        });
        
        // generate a document in the images collection on our database and 
        // and respond with the ObjectID of that document
        let db = client.db('START-Project');
        let images = db.collection('images');
        let { name, mimetype, size } = image; 

        images.insertOne({ name, mimetype, size }).then((response) => {
            return res.status(200).send(response.insertedId);
        }).catch((err)   => {
            console.log(err);
            return res.status(400).send(err);
        });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

/**
 * Get endpoint that retrieves an image file from the uploads folder with the same
 * name as the images document that corresponds to the request photoId parameter.
 */
app.get('/image/:photoId', (req, res) => {
    let params = req.params;
    if(!params.photoId) return res.status(400).send('No image ID was sepcified.');
    
    try {
        // load the images collection from the START-Project db
        let db = client.db('START-Project');
        let images = db.collection('images');

        // search an image document using the passed in photoid
        images.find({_id: ObjectID(params.photoId)}).toArray((err, searchRes) => {
            if (err) return res.status(400).send(err.message);
            if (searchRes.length == 0) return res.status(404).send('Could not find an image with the specified ID.');

            // get the name of the file we're looking for and search for it in /uploads
            let name = searchRes[0].name;
            let file = '';
            fs.readdir('uploads', (err, files) => {
                if (err) return res.status(500).send(err);
                
                // search for file with the name were looking for
                file = files.filter((curr) => curr == name);
                (file.length > 0) ? file = file[0] : undefined;
                
                if(!file) res.status(404).send('Could not find a file with the name: ', name);
                else return res.status(200).sendFile(path.join(__dirname + '/uploads/' + file));
            });
        });
    } catch(err) {
        res.status(500).send(err.message);
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
        
        // convert list of strings to JSON objects so that they can be queryable later
        // also make field names lowercase for case insensitive comparisons 
        for (let i = 0; data.inputFields && i < data.inputFields.length; i++) {
            if (typeof data.inputFields[i] == 'string') data.inputFields[i] = JSON.parse(data.inputFields[i]);
            data.inputFields[i].name = data.inputFields[i].name.toLowerCase();
            data.inputFields[i].value = sanitize(data.inputFields[i].value);
            
            // convert value fields that should be numbers to numbers
            if (data.inputFields[i].dataValidation && data.inputFields[i].dataValidation.isNumber) 
            data.inputFields[i].value = Number(data.inputFields[i].value);
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

    let queryObj = (params.category) ? {category: params.category} : {};
    if (params.states) {
        // loop over all the states and append the conditions to the query object
        for (let state of params.states) {
            if (typeof state == 'string') state = JSON.parse(state);
            state.value = sanitize(state.value);

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
            let currSubQuery = {$elemMatch: {name: state.name.toString().toLowerCase(), value: state.value.toString().toLowerCase()}};
            if (!queryObj.inputFields) queryObj.inputFields = {$all: [currSubQuery]};
            else queryObj.inputFields.$all = [...queryObj.inputFields.$all, currSubQuery];
        }
    }
    
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
