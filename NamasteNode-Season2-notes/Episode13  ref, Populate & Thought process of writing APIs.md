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



###### user/requests API in userRouter:-



```javascript

const express = require("express");

const { userAuth } = require("../middlewares/auth");

const { ConnectionRequest } = require("../models/connectionRequest");

const userRouter = express.Router();



//user request API

userRouter.get("/user/requests", userAuth, async (req,res) => {

&#x20;   //plan the api

&#x20;   //validate the logged in user

&#x20;   //find the connection request in which the logged in user is toUser

&#x20;   //find the request with the interested field only

&#x20;   //send the all connection with interested code to the user



try {

&#x20;   const logedInUser = req.user;

&#x20;   const connectionRequest = await ConnectionRequest.find({

&#x20;       toUserId: logedInUser.\_id,

&#x20;       status: "interested"

&#x20;   });

&#x20;   if(!connectionRequest){

&#x20;       return resizeBy.status(404).json({message: "No request found!"});

&#x20;   }



&#x20;   res.json({

&#x20;       message: "Request found",

&#x20;       connectionRequest

&#x20;   });



&#x20;   } 

catch (err) {

&#x20;       res.status(400).send("Error: "+err.message);

&#x20;   }

});



module.exports = {userRouter};



```





