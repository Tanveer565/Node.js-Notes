Episode-13 - ref, Populate \& Thought process of writing APIs





Plan your API first:

###### review Connection request API:-



```javascript

//planning the API

&#x20;        // if tan sends connection reqest naz then naz should be the logged in user

&#x20;        //check status(accepted or rejected)

&#x20;        //check if connction request exsist

&#x20;        //In connction Req:-

&#x20;       // status = interested

&#x20;       // \_id.requestId should exsist

&#x20;       // toUserId = logged in user Id



//review Connection request

requestRouter.post("/request/review/:status/:requestId", userAuth, async(req,res) => {

&#x20;   try {



&#x20;       const logedInUser = req.user;

&#x20;       const {status, requestId} = req.params;



&#x20;       const allowedStatus = \["accepted","rejected"];

&#x20;       if(!allowedStatus.includes(status)){

&#x20;           return res.status(404).json({message: status+"Status not allowed!"});

&#x20;       }



&#x20;       const connectionRequest = await ConnectionRequest.findOne({

&#x20;           \_id:requestId,

&#x20;           toUserId: logedInUser,

&#x20;           status: "interested"

&#x20;       });



&#x20;       if(!connectionRequest){

&#x20;           return res

&#x20;           .status(404)

&#x20;           .json({message: "Connection request not found"});

&#x20;       }

&#x20;       

&#x20;       //replacing the status of the connection request

&#x20;       connectionRequest.status = status;



&#x20;       const data = await connectionRequest.save();



&#x20;       res.json({

&#x20;           message: logedInUser.firstName+" has "+status+ " the connection request",

&#x20;           data

&#x20;       });    



&#x20;   } catch (err) {

&#x20;       res.status(400).send("Error: "+err.message);

&#x20;   }

});



```



###### /user/requestS/recieved API in userRouter:-



```javascript

const express = require("express");

const { userAuth } = require("../middlewares/auth");

const { ConnectionRequest } = require("../models/connectionRequest");

const userRouter = express.Router();



//user request API

const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { ConnectionRequest } = require("../models/connectionRequest");
const userRouter = express.Router();


const USER_SAFE_DATA = ["firstName","lastName","photoUrl","age","gender","about","skills"];
//Find all user request API
userRouter.get("/user/requests/recieved", userAuth, async (req,res) => {
try {

    const logedInUser = req.user;
    const connectionRequest = await ConnectionRequest.find({
        toUserId: logedInUser._id,
        status: "interested"
    }).populate("fromUserId",USER_SAFE_DATA);
    //populate("fromUserId","firstName lastName photoUrl age gender about skills") you can also pass like string
    

    if(!connectionRequest){
        return res.status(404).json({message: "No request found!"});
    }
    res.json({
        Request: connectionRequest
    });} 
catch (err) {
        res.status(400).send("Error: "+err.message);
    }
});

//find all user connections API
userRouter.get("/user/connections",userAuth, async (req,res) => {
    try {

        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            $or: [
                {fromUserId: loggedInUser._id, status: "accepted"},
                {toUserId: loggedInUser._id, status: "accepted"}
            ]
            //populate both the case:
        }).populate("fromUserId",USER_SAFE_DATA).populate("toUserId",USER_SAFE_DATA);

        if(!connectionRequests){
            return res.status(404).json({message: "You have no connections"});
        }

        //we do not need the extra field present in req so we will map it
        //do not forget to use toString otherwise the code will try to 
        //match mongo object id which  will not be equal
        const data = connectionRequests.map((row) => {
           if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
            return row.toUserId;
           }
           return row.fromUserId;
        });

        res.json({
            data: data
        })
        
    } catch (err) {
        res.status(400).send("Error: "+err.message);
    }
});

module.exports = {userRouter};

//using ref in from and to userId:
fromUserId:{
        type: mongoose.Schema.Types.ObjectId,
        //creating reference to the user collection
        ref:"User",
        required: true,
    },
    toUserId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true,
```

###### Ref and Populate:-


ref:- is how you define a relationship in a schema or you make a connection between the models

populate() is how you replace a stored reference with the actual document from the other collection.
A common pattern looks like this:

import mongoose from 'mongoose';

```javascript
const { Schema, SchemaTypes, model } = mongoose;

const userSchema = new Schema({
  name: String,
  email: String,
});

const blogSchema = new Schema({
  title: String,
  author: {
    type: SchemaTypes.ObjectId,
    ref: 'User',
  },
});

const User = model('User', userSchema);
const Blog = model('Blog', blogSchema);
```

Then you store a reference:

```javascript
const user = await User.create({ name: 'Jess', email: 'jess@example.com' });

await Blog.create({
  title: 'Awesome Post!',
  author: user._id,
});

And later you populate it:

const post = await Blog.findOne({ title: 'Awesome Post!' }).populate('author');
console.log(post.author);
```
That turns author from an ObjectId into the full User document.

A few important notes:-

ref points to the model name, such as 'User'.
The field being referenced is usually an ObjectId.
populate() performs an additional query to fetch the referenced document.
You can also populate arrays of references.






