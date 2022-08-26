'use strict'

// Express App (Routes)
const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');
const sanitize = require('mongo-sanitize');
const bodyParser = require('body-parser');  
const fileUpload = require('express-fileupload');
const jsonexport = require('jsonexport');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(fileUpload());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// DB client
const { MongoClient } = require('mongodb');
const { ObjectID } = require('bson');
const uri = process.env.MONGODB;
const client = new MongoClient(uri);
const port = process.env.PORT || 5000;
const MONGOLIMIT = 15728640; // let the limit be 1 MB less than actual limit to be safe

// Google client
const { google } = require('googleapis');

// google cloud service account credentials
const GoogleCreds = {
    email: process.env.CLIENT_EMAIL,
    key: process.env.PRIVATE_KEY?.replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/drive.metadata.readonly', 'https://www.googleapis.com/auth/drive']
}

/**
 * Async function that attempts fetching a JSON Web Token for google drive API.
 */
async function FetchJWT () {
    try {
        let jwtClient = new google.auth.JWT(
            GoogleCreds.email,
            null,
            GoogleCreds.key,
            ["https://www.googleapis.com/auth/drive", "https://www.googleapis.com/auth/drive.file", "https://www.googleapis.com/auth/drive.metadata"],
            null
        );
        
        return jwtClient;
    } catch (err) { 
        return undefined; 
    }
}

/**
 * Asynchronous function that uploads a file to google drive in a passed in parent folder.
 */
async function UploadFile(drive, uploadName, localName, parentFolder, type) {
    // initialize metadata and media for upload 
    let fileMetadata = {
        title: uploadName,
        name: uploadName,
        parents: [parentFolder]
    };
    
    let media = {
        mimeType: type,
        body: fs.createReadStream(localName),
    };
    
    // upload the file to drive  
    await drive.files.create({
        resource: fileMetadata,
        media,
        fields: 'id',
    });

    // delete local file
    fs.unlinkSync(localName);
}

/**
 * Async function that attempts connecting to the database.
 */
async function DBConnect() {
    try {
        await client.connect();    
        console.log("Connected successfully to database");
    } catch (e) {
        console.log(e);
    } 
}

DBConnect();

/**
 * Login endpoint that authenticates passed credentials
 * with existing documents in the database and sends 
 * a success response if they exist.
 */
app.get('/signin', async (req, res) => {
    if (!req.query || !req.query.username || !req.query.password)
    return res.status(400).send('Invalid credentials. Please verify you have entered the correct username and password.');
    
    const username = sanitize(req.query.username);
    const password = sanitize(req.query.password);

    try {
        // search the credentials collection in the START-Project
        // database for the passed username and password
        let db = client.db('START-Project');
        let credentials = db.collection('credentials');
        let results = credentials.find({username, password});
    
        // retrieve the array of the account and respond with the id
        try {
            results = await results.toArray();

            if (results.length <= 0) 
            return res.status(500).send('Invalid credentials. Please verify you have entered the correct username and password.');

            return res.status(200).send({
                id: results[0]._id, 
                sharedEntries: results[0].sharedEntries || [],
                read: results[0].read || false,
                write: results[0].write || false
            });
        } catch(err) {
            return res.status(500).send(err);
        }
    } catch (error) {
        return res.status(400).send(error);
    }
});

/**
 * Admin login endpoint that authenticates passed in credentials
 * with existing documents in the database and sends 
 * a success response if they exist.
 */
 app.get('/admin-signin', async (req, res) => {
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
        try {
            results = await results.toArray();

            if (results.length <= 0) 
            return res.status(500).send('Invalid credentials. Please verify you have entered the correct username and password.');

            return res.status(200).send(results[0]._id);
        } catch(err) {
            return res.status(500).send(err);
        }
    } catch (error) {
        return res.status(400).send(error);
    }
});

/**
 * Signup endpoint that authenticates passed credentials
 * with existing documents in the database and sends 
 * a fail response if they exist, create a new document for
 * them otherwise.
 */
app.post('/signup', async (req, res) => {
    if (!req.body || !req.body.username || !req.body.password)
    return res.status(400).send('Username and password were not sent to the server.');

    const username = sanitize(req.body.username);
    const password = sanitize(req.body.password);
    
    try {
        // search the credentials collection in the START-Project
        // database for the passed username and password
        let db = client.db('START-Project');
        let credentials = db.collection('credentials');
        let results = credentials.find({username});

        // retrieve the array of the account and respond with the fail
        // if it has any elements
        try {
            results = await results.toArray(); 
            if (results.length > 0) {
                throw 'An account already exists with this username. Try to login or use a different username.';
            }
            
            // insert a new document with the username and password
            try {
                await credentials.insertOne({
                    username,
                    password
                });
                return res.status(200).send('');
            } catch (e) {
                return res.status(400).send(e);
            }
        } catch(err) {
            return res.status(400).send(err);
        }
    } catch (error) {
        return res.status(500).send(error);
    }
});

/**
 * Username endpoint without parameters that retrieves all the non-admin
 * user data from the credentials collection in our START-Project database.
 * It responds with an array of usernames or an error message if it fails.
 */
app.get('/username', async (req, res) => {
    try {
        // load the credentials collection from the START-Project db
        let db = client.db('START-Project');
        let credentials = db.collection('credentials');

        // respond with an array of all usernames and their ids
        try {
            let results = await credentials.find({}).toArray(); 
            
            let users = [];
            for (let user of results) {
                let { username, _id, write, read } = user;
                users.push({username, _id, write, read});
            }
            return res.status(200).send(users);
        } catch (err) {
            return res.status(400).send(err);
        }
    } catch(error) {
        res.status(500).send(error);
    }
});

/**
 * Username endpoint that retrieves the username of an account 
 * in the database with the same ID as the passed in userId parameter.
 * It responds with the username if the database query is successful, or an 
 * error otherwise. 
 */
app.get('/username/:userId', async (req, res) => {
    const params = req.params;
    if (!params.userId) return res.status(404).send('No user ID was sepcified.');
    
    try {
        // load the credentials collection from the START-Project db
        let db = client.db('START-Project');
        let credentials = db.collection('credentials');

        // search for a credentials document using the passed in userid
        try {
            let searchRes = await credentials.find({_id: ObjectID(params.userId)}).toArray();
            
            if (searchRes.length == 0) 
            return res.status(404).send('Could not find a user with the specified ID.');
            
            return res.status(200).send(searchRes[0].username);
        } catch(err) {
            return res.status(400).send(err);
        }
    } catch(error) {
        return res.status(500).send(error);
    }
});

/**
 * Password update endpoint that verifies the passed in credentials
 * for the account with the passed in userid parameter, then 
 * it updates the password of that account if the credentials are valid.
 * It responds with a success message or an error message if any of the
 * queries failed.
 */
app.put('/password/:userid', async (req, res) => {
    try {
        const params = {...req.params, ...req.body};
        if (!params.userid || (!params.currentPassword && !params.admin) || !params.newPassword)
        return res.status(404).send('Failed to retrieve your user information.');

        // load the credentials collection from the START-Project db
        let db = client.db('START-Project');
        let credentials = db.collection('credentials');

        // search for a credentials document using the passed in userid
        if (!params.admin) {
            try {
                let searchRes = await credentials.find({_id: ObjectID(params.userid)}).toArray();
                if (searchRes.length == 0) return res.status(404).send('Could not find a user with the specified ID.');
                if (searchRes[0].password !== params.currentPassword) return res.status(403).send('Invalid current password.');
            } catch (err) {
                return res.status(400).send(err.message);
            }
        }
        
        // update the password now that we know the credentials are valid
        try {
            await credentials.updateOne({_id: ObjectID(params.userid)}, 
            {
                $set: {
                    password: params.newPassword
                }
            });
            
            return res.status(200).send('Successful update.');
        } catch (err) {
            return res.status(400).send(err);
        }
    } catch(error) {
        return res.status(500).send(error);
    }
});

/**
 * Put request that changes the permissions of a specified user, it takes in an account id
 * write and read body parameters where write & read are boolean values that specify 
 * whether the user should have this permission or not. It sets the values in the
 * user's document in the credentials collection on the START-Project database. 
 * Responds with an error message otherwise.
 */
app.put('/user/permissions', async (req, res) => {
    try {
        const { accountId, read, write } = req.body;

        // load the credentials collection from the START-Project db
        let db = client.db('START-Project');
        let credentials = db.collection('credentials');

        // search for a credentials document using the passed in account id
        try {
            let user = await credentials.findOne({_id: ObjectID(accountId)});
            
            if (!user) 
            return res.status(404).send('Could not find a user with the specified account id.');
            
            // update read/write permissions
            user.read = (read !== undefined) ? read : user.read; 
            user.write = (write !== undefined) ? write : user.write;
            await credentials.replaceOne({_id: ObjectID(user?._id)}, user);

            return res.status(200).send('');
        } catch(err) {
            return res.status(400).send(err);
        }
    } catch (error) {
        return res.status(500).send(error);
    }
});

/**
 * Delete user endpoint that takes in a userid parameter and 
 * deletes the matching account document from the credentials collection
 * in our START-Project database. Returns a success message or an error
 * message if the query fails or a user id isn't provided 
 */
app.delete('/user/:userid', async (req, res) => {
    const params = req.params;
    if (!params.userid) return res.status(400).send('Failed to retrieve your user information');

    try {
        // load the credentials collection from the START-Project db
        let db = client.db('START-Project');
        let credentials = db.collection('credentials');
        
        // delete the first document that matches the passed in id (there is only 1)
        try {
            let response = await credentials.deleteOne({_id: ObjectID(params.userid)}); 

            // check if the document was actually deleted
            if (!response?.deletedCount) 
            return res.status(500).send('Could not perform delete operation. Please try again at a later time.');
            
            return res.status(200).send('Successfully deleted your account.');
        } catch(err) {
            return res.status(400).send(err);
        }
    } catch (error) {
        return res.status(500).send(error);
    }
});

/**
 * Update shared entries endpoint that takes in a request body with a username and
 * a new entry's data. It then modifies the user's credentials document in the 
 * START-Project database by adding the entry datat to the sharedEntries list.
 * Responds with an error otherwise.   
 */
app.patch('/user/shares', async (req, res) => {
    try {
        const params = {...req.body};
        const { username, data } = params;
        
        // load the credentials collection from the START-Project databases
        let db = client.db('START-Project');
        let credentials = db.collection('credentials');
        
        // find the user document with the passed in username 
        let user = await credentials.findOne({username});
        if (!user) return res.status(404).send('Could not find the user with the specified username.');
        
        // add the shared data entry to the user document and save it to the database
        user.sharedEntries = (user.sharedEntries) ? [...user.sharedEntries, data] : [data];
        await credentials.replaceOne({_id: ObjectID(user._id)}, user);

        return res.status(200).send('');
    } catch (error) {
        return res.status(500).send(error);
    }
});

/**
 * Patch shared entry endpoint that takes in a username and entry id body parameters
 * and searches the credentials collection for the user and their shared entry that
 * matches the id. It then deletes that entry from the user's sharedEntries list.
 * Responds with an error message if failed. The reason I used patch here is because 
 * we aren't deleting the entire document and to have access to body parameters.
 */
app.patch('/user/entry', async (req, res) => {
    try {
        const { entryId, username } = req.body;
        if (!entryId) return res.status(400).send('Invalid entry id provided.');

        // load the credentials collection from the START-Project databases
        let db = client.db('START-Project');
        let credentials = db.collection('credentials');

        // find the user document with the passed in username 
        let user = await credentials.findOne({username});
        if (!user) return res.status(404).send('Could not find the user with the specified username.');

        // find the shared entry with the specified entryId
        let entry = user.sharedEntries?.find(elem => elem.entryId == entryId);
        if (!entry) return res.status(400).send('Could not find a matching shared data entry linked to your account.');
        
        // delete all the entry's image documents in photoIds
        if (entry.photoIds?.length) {
            let images = db.collection('images');
            for (let id of entry.photoIds) {
                await images.deleteOne({_id: ObjectID(id)});
            }
        }

        // remove the shared entry with a matching id to the one specified in the req body
        user.sharedEntries = user?.sharedEntries?.filter(elem => elem.entryId != entryId);
        await credentials.replaceOne({_id: ObjectID(user._id)}, user);

        return res.status(200).send('');
    } catch (error) {
        return res.status(500).send(error);
    }
});

/**
 * Post a duplicate document endpoint that takes in an array of document ids and 
 * a collection name then creates duplicate documents in the same collection and 
 * responds with their ids. It responds with an error message if that process fails.
 */
app.post('/duplicate', async (req, res) => {
    try {
        let { collectionName, docIds } = req.body;
        if (!collectionName || !docIds?.length) return res.status(400).send('Invalid parameters specified.');
        
        // load the specified collection name in the START-Project database
        let db = client.db('START-Project');
        let collection = db.collection(collectionName);
        
        // search for each document using its id and insert it 
        // as a new document if found 
        let newIds = [];
        for (let id of docIds) {
            // seperate the id from the document elements to generate new id upon insertion
            let { _id, ...doc } = await collection.findOne({_id: ObjectID(id)});
            if (!doc) return res.status(400).send('Could not find some or all the documents with the specified ids.');
            

            let newDoc = await collection.insertOne(doc);
            if (!newDoc?.insertedId) return res.status(500).send('Failed to duplicate your documents, please try again later.');
            newIds.push(newDoc?.insertedId);
        }

        return res.status(200).send(newIds);
    } catch(err) {
        return res.status(500).send(err);
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
        
        // generate a document in the images collection on our database and 
        // and respond with the ObjectID of that document
        let db = client.db('START-Project');
        let images = db.collection('images');
        let { name, mimetype, size } = image; 

        // store our image in the uploads folder on our server as backup for small
        // images and as main storage for oversized images 
        image.mv('uploads/' + image.name, err => {
            // failure to store oversized image results in error response
            if(err && image.size > MONGOLIMIT) return res.status(500).send(err);
        });
        
        // upload image to the database if its smaller than MONGOLIMIT, otherwise just name and metadata 
        try {
            let response = await images.insertOne((image.size <= MONGOLIMIT) ? image : {name, mimetype, size});
            return res.status(200).send(response.insertedId);
        } catch(err) {
            return res.status(400).send(err);
        }
    } catch(error) {
        return res.status(500).send(error);
    }
});

/**
 * Get endpoint that retrieves an image file from the uploads folder with the same
 * name as the images document that corresponds to the request photoId parameter.
 */
app.get('/image/:photoId', async (req, res) => {
    let params = req.params;
    if(!params.photoId) return res.status(400).send('No image ID was sepcified.');
    
    try {
        // load the images collection from the START-Project db
        let db = client.db('START-Project');
        let images = db.collection('images');

        const ServerImageFetch = (image) => {
            // get the name of the file we're looking for and search for it in /uploads
            let name = image.name;
            let file = '';
            fs.readdir('uploads', (err, files) => {
                if (err) return res.status(500).send(err);
                
                // search for file with the name were looking for
                file = files.filter(curr => curr == name);
                file = (file.length > 0) ? file[0] : undefined;
                
                if(!file) 
                return res.status(404).send('Could not find a file with the name: ', name);

                return res.status(200).sendFile(path.join(__dirname + '/uploads/' + file));
            });
        }

        // search an image document using the passed in photoid
        try {
            let searchRes = await images.find({_id: ObjectID(params.photoId)}).toArray();
            if (searchRes.length == 0) return res.status(404).send('Could not find an image with the specified ID.');
            
            // Execute this branch when the image is physically stored in the database
            // document as binary
            if (searchRes[0].data) {
                // attempt to write binary image to a file
                let buffer = searchRes[0]?.data?.read(0, searchRes[0].data.length);
                fs.writeFile('pic.jpeg', buffer, err => {
                    if (!err) return res.status(200).sendFile(path.join(__dirname, '/pic.jpeg'));

                    // use server backup on image write failure 
                    ServerImageFetch(searchRes[0]);
                });
            }

            // Oversized images will likely be the ones to enter this branch > MONGOLIMIT
            // unless someone manually deleted image data from the database for some reason 
            else ServerImageFetch(searchRes[0]);
        } catch (err) {
            return res.status(400).send(err);
        }
    } catch(error) {
        return res.status(500).send(error);
    }
});

/**
 * Fields endpoint that retrieves all the data entry fields for all the categories
 * on the fields collection in the START-Project database. Returns an array of all the 
 * categories if the query was successful, an error otherwise.
 */
app.get('/fields', async (req, res) => {
    try {
        // load the fields collection from the START-Project db
        let db = client.db('START-Project');
        let fields = db.collection('fields');

        // return all field documents in response
        try {
            let searchRes = await fields.find({}).toArray(); 
            return res.status(200).send(searchRes);
        } catch(err) {
            return res.status(400).send(err);
        }
    } catch(error) {
        return res.status(500).send(error);
    }
});

/**
 * Put endpoint that updates all the field documents in the fields collections.
 * It takes in a request body with an array of objects, deletes the old documents and
 * pushes the new fields to the collection. It responds with a success message or
 * an error message on failure.
 */
app.put('/addFields', async (req, res) => {
    if (!req?.body?.fields) return res.status(400).send('Failed to push new release due to insufficient fields.');

    try {
        // load the fields collection from the START-Project db
        let db = client.db('START-Project');
        let fields = db.collection('fields');
        
        // delete old fields then insert the new ones
        await fields.deleteMany({});
        req.body.fields.forEach(element => {
            element._id = ObjectID(element._id);
        });

        await fields.insertMany(req.body.fields);
        return res.status(200).send('Successfuly pushed the new release version.');
    } catch (err) {
        res.status(500).send(err);
    }
});

/**
 * Data Entry endpoint that sends in passed data to the reptiles
 * collection in the START-Project database. Returns a success or fail
 * based on the database response.
 */
app.post('/dataEntry', async (req, res) => {
    const data = req.body;
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
        
        try {
            await reptiles.insertOne(data);
            return res.status(200).send('');
        } catch(err) {
            return res.status(400).send(err);
        }
    } catch(error) {
        return res.status(500).send(error);
    }
});

/**
 * Delete entry endpoint that takes in an entry id parameter and 
 * deletes the matching reptile entry document from the reptiles collection
 * in our START-Project database. Returns a success message or an error
 * message if the query fails or an entry id isn't provided 
 */
app.delete('/entry/:entryId', async (req, res) => {
    if (!req?.params?.entryId) return res.status(400).send('Failed to delete data entry due to unprovided entry id.');

    try {
        // load the reptiles collection from the START-Project db
        let db = client.db('START-Project');
        let reptiles = db.collection('reptiles');
        
        // delete the first document that matches the passed in id (there is only 1)
        try {
            let response = await reptiles.deleteOne({_id: ObjectID(req.params.entryId)});
            
            if (!response?.deletedCount) 
            return res.status(500).send('Could not perform delete operation. Please try again at a later time.');

            return res.status(200).send('Successfully deleted entry.');
        } catch(err) {
            return res.status(400).send(err);
        }
    } catch (error) {
        return res.status(500).send(error);
    }
});

/**
 * Export data entries post endpoint that takes in an array of json data entries,
 * parses that request body data into csv format and exports it to a csv file in the
 * current directory. Responds with an error message if failed.  
 */
app.post('/export', async (req, res) => {
    try {
        let [...entries] = req.body;
        let photoIds = [];
        
        // loop through all entries and append inputFields into to the entry
        // json fields on the top level of the entry
        let i = 0;
        for (let { inputFields, ...entry } of entries) {
            for (let field of inputFields) {
                entry[field.name] = field.value;
            }
            
            if (entry.photoIds?.length) photoIds = [...photoIds, ...entry.photoIds];
            entries[i++] = entry;
        }
        
        // parse json into csv format
        const csvData = await jsonexport(entries, { fillTopRow: true });

        // write the csv file
        fs.writeFileSync('entries.csv', csvData);

        // initialize drive client
        const token = await FetchJWT();
        let drive = google.drive({ version: 'v3', auth: token });
        
        // fetch parent folder id 
        let files =  await drive.files.list({ auth: token });
        let parentFolder = '';
        for (let file of files.data.files) {
            if (file.name.toLowerCase().includes('exported entries')) 
                parentFolder = file.id;
        }

        // create a folder for this export 
        let fileMetadata = {
            name: 'Entries',
            title: 'Entries',
            mimeType: 'application/vnd.google-apps.folder',
            parents: [parentFolder]
        };

        let exportFolder = await drive.files.create({
            resource: fileMetadata,
            fields: 'id',
        });

        parentFolder = exportFolder.data.id;

        // Upload the csv file to google drive 
        await UploadFile(drive, 'entries.csv', 'entries.csv', parentFolder, 'text/csv');
        
        // load the images collection from the START-Project db
        let db = client.db('START-Project');
        let images = db.collection('images');
        
        // upload entry images to parent folder
        for (let photo of photoIds) {
            let searchRes = await images.findOne({_id: ObjectID(photo)});
            if (!searchRes || !searchRes.data) continue;

            // attempt to write binary image to a file
            let buffer = searchRes?.data?.read(0, searchRes.data.length);
            fs.writeFileSync('pic.jpeg', buffer);
            
            // upload the image
            await UploadFile(drive, `${photo}.jpeg`, 'pic.jpeg', parentFolder, 'image/jpeg');
        }
        
        return res.status(200).send(`https://drive.google.com/drive/folders/${parentFolder}`);
    } catch (error) {
        return res.status(500).send(error);
    }
});

/**
 * Search endpoint that searches the reptiles collection in the
 * START-Project database for the values specified in the selections 
 * and states. 
 */
app.get('/search', async (req, res) => {
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
        
        try {
            let searchRes = await reptiles.find(queryObj).toArray();
            return res.status(200).send(searchRes);
        } catch(err) {
            return res.status(400).send(err);
        }
    } catch(error) {
        return res.status(500).send(error);
    }  
});

app.listen(port);
