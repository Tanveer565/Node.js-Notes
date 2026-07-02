Episode:6 Database, Schemas and Models - Mongoose



refer Mongoose documentation.



###### mongoose:- 

&#x20;         Mongoose is an Object Data Modelling (ODM) library for MongoDB. You can use Mongoose to help with data modelling, schema enforcement, model validation, and general data manipulation. Because MongoDB has a flexible data model that allows you to alter and update databases in the future, there aren't rigid schemas.





Install mongoose from npm install mongoose

then created a separate folder inside src and created a file database to create  database.



###### config folder :-

&#x20;               A configuration file is a special type of file used by programs to store settings and options. Think of it as a set of instructions that tells the software how to behave. For example, it might specify what database to connect to, what features to enable, or how the program should look and function.



Then we created a connection to the DB Using : //connection to the DB through the string 

&#x20;     "mongodb+srv://mongodb.net/devMeet"



Note:- One important thing is that you have to connect to you DB before the sever even start to listening because if you will not do it might be a case that server is started listening but DB is still not connected.



###### Schema :-



Now we will create a folder model inside src to modelling over data and file user.js to create a schema for our user.



Schema- It is an identity for the collection user or it defines a user like what a user can have. It holds that what a user can have , what fields is there for the user and also what type of data it can have. (defining all what a user can store.



###### Models:-

Models are fancy constructors compiled from Schema definitions. An instance of a model is called a document. Models are responsible for creating and reading documents from the underlying MongoDB database.



if you create a database of user then models will copy you schema of user and then can use it for an instance of you user like for user1, user-homelander



###### Constructing Documents :-



An instance of a model is called a document. Creating them and saving to the database is easy.



#### Code:-



###### Connecting to the database:-

```javascript



const mongoose = require("mongoose");



const dns = require('dns');

//to bypass the home router which is slow and retricted

// Force Node to use Google DNS to find the SRV record

dns.setServers(\['8.8.8.8', '8.8.4.4']);





const connectdb = async() => {

&#x20;    await mongoose.connect(

&#x20;       //connecting to the db through the string connection

&#x20;       //connecting to the cluster 

&#x20;       //to connect direclty to db add name after /. /dbname

&#x20;     "mongodb+srv://mongodb.net/devMeet"

);

}



module.exports = connectdb;



```

###### 

###### creating Schema and model for collection users:-



```javascript



//In this file i will define what a user in our database is or what field 

// a user can have in which type of data. basically defining schema for a user.



const mongoose = require("mongoose");



//Creating user schema

const userSchema = new mongoose.Schema({

&#x20;   //in this object we will define fields for user schema



&#x20;   firstName: {

&#x20;       type: String

&#x20;   },

&#x20;   lastName: {

&#x20;       type: String

&#x20;   },

&#x20;   email:{

&#x20;       type:String

&#x20;   },

&#x20;   password: {

&#x20;       type: String

&#x20;   },

&#x20;   age: {

&#x20;       type: Number

&#x20;   },

&#x20;   Gender: {

&#x20;       type: String

&#x20;   }

&#x20;   //This schema tells you what can you store for a user.

});



//Creaitng a model for user

const User = mongoose.model("User",userSchema);



module.exports = User;





```



###### Creating new users into the database:-



```javascript



const express = require("Express");

const connectdb = require("./src/config/database");

const User = require("./src/models/user");





const app = express();



//signup

app.post("/signup",async (req,res) => {

&#x20;   //Create a new instance of the model User to add new user info

&#x20;   const user = new User({

&#x20;       firstName:"Messi",

&#x20;       lastName:"Messi",

&#x20;       email:"Messi@gmail.com",

&#x20;       password:"Ronaldo The G.O.A.T",

&#x20;       age:49

&#x20;   });



&#x20;   try{ 

&#x20;        //The save function returns a promise so you have to use await

&#x20;        await user.save();

&#x20;        res.send("New User");

&#x20;   }

&#x20;   catch(err){

&#x20;       res.status(400).send("Error in saving the user!"+err.message);

&#x20;   }

});



//connecting to Db before server start listening.

connectdb()

.then(() => {

&#x20;   //Giving prior to the Db then only start listening to the server

&#x20;   console.log("Database connection establish!");

&#x20;   app.listen(1313,() => {

&#x20;   console.log("The Server is listening on the port 1313");

});

})

.catch(err => {

&#x20;   console.error("Database cannot be connected");

});





```



###### database saved user :-



{

&#x20; "\_id": {

&#x20;   "$oid": "6a0524618e38d0ff127da6ba"

&#x20; },

&#x20; "firstName": "Cristiano",

&#x20; "lastName": "Ronaldo",

&#x20; "email": "RonaldoGoat@gmail.com",

&#x20; "password": "Messy-Messy",

&#x20; "age": 49,

&#x20; "\_\_v": 0

}



mongodb itself generate the id and \_v for every new user



1\. \_id (The Primary Key)

Every document in a MongoDB collection requires a unique \_id field. It acts as the Primary Key.



Automatic Generation: If you don't provide one when saving a document, MongoDB (or Mongoose) automatically generates a 12-byte ObjectId.



Uniqueness: It ensures that every single entry in your database can be uniquely identified, even if all other data (like name or email) is identical.



Structure: An ObjectId is not just a random string; it contains encoded information, including:



A Timestamp (when the document was created).



A Machine identifier.



A Process ID.



A Counter (to prevent collisions in the same second).







2\. \_\_v (The Version Key)

The \_\_v field is specific to Mongoose (it is not a native MongoDB feature). It is known as the versionKey.



Purpose: It is used for Internal Revision Tracking. It helps Mongoose keep track of how many times a document has been updated in a way that might affect arrays or sub-documents.



Concurrency: It helps prevent "Document Overwrite" issues. If two different processes try to update the same document at the exact same time, Mongoose uses this value to ensure the updates don't conflict or overwrite each other unintentionally (a concept called "Optimistic Concurrency").



Default Value: It starts at 0 when a document is first created and increments automatically when certain types of updates occur.



