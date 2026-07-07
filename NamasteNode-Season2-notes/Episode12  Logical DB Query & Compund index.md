Episode-12 - Logical DB Query \& Compound Indexes



MongoDb Query: https://www.geeksforgeeks.org/mongodb/what-is-a-mongodb-query/



Creating the connection request schema for defining the fields and validations for two user to make the connection.





###### **Connection Request Schema:-**





```javascript



const mongoose = require("mongoose");



//schema for connection requests

const connectionRequestSchema = new mongoose.Schema({



&#x20;   fromUserId:{

&#x20;       type: mongoose.Schema.Types.ObjectId,

&#x20;       required: true,

&#x20;   },

&#x20;   toUserId:{

&#x20;       type: mongoose.Schema.Types.ObjectId,

&#x20;       required: true,

&#x20;   },

&#x20;   status:{

&#x20;       type: String,

&#x20;       required:true,

&#x20;       enum:{

&#x20;           values: \["ignored","interested","accepted","rejected"],

&#x20;           message: `{VALUE} is not supported`

&#x20;       }

&#x20;   },

},{

&#x20;   timestamps:true,

}

);



//Adding the index on fromUserId and toUserId so our mongoose will optimize it for fast query

connectionRequestSchema.index({fromUserId: 1, toUserId: 1});







const ConnectionRequest = mongoose.model("ConnectionRequest", connectionRequestSchema);





//keepin a check on from user id should not be equal to touserId is a job of schema that is why this check is made into schema



// schema.pre() is Mongoose middleware, used to run code before certain schema-level operations like 

// save,validate, updateOne, findOneAndUpdate, and more.

connectionRequestSchema.pre("save", function (next){

&#x20;   const connectioRequest = this;



&#x20;   //userId (from Mongoose/Database): Once Mongoose fetches a document, it automatically converts

&#x20;   //that field into an ObjectId instance. That is why console.log shows it as new ObjectId('...').

&#x20;   // If you try toUserId === userId, it will be false because you are comparing a String to an Object.

&#x20;   // Mongoose's .equals() handles the string-to-object comparison for you

&#x20;    if (connectioRequest.fromUserId.equals(connectioRequest.toUserId)) {

&#x20;       throw new Error("You cannnot send connection request to yourself!!");

&#x20;   }

&#x20;   next();

});



module.exports = {ConnectionRequest};



```



###### **Connection Request API:-**



```javascript



const express = require("express");

const {userAuth} = require("../middlewares/auth");

const {ConnectionRequest} = require("../models/connectionRequest");

const {User} = require("../models/user");





const requestRouter = express.Router();



//sendConnectionRequest

requestRouter.post("/request/send/:status/:toUserId", userAuth, async(req,res) => {

&#x20;  try {

&#x20;   const fromUserId = req.user.\_id;

&#x20;   const toUserId = req.params.toUserId;

&#x20;   const status = req.params.status;



&#x20;   //Validating status

&#x20;   const allowedStatus = \["ignored","interested"];

&#x20;   if(!allowedStatus.includes(status)){

&#x20;       return res.status(400).json({message:"Invalid status type: "+status});

&#x20;   }



&#x20;   // validating the toUserId (is present)

&#x20;   const toUser = await User.findById(toUserId);

&#x20;   if(!toUser){

&#x20;       return res.status(404).json({message: "User not found!!"});

&#x20;   }



&#x20;   //if a Connection request exisit already

&#x20;     //conditions: 1.cannot send the connection request twice from one user

&#x20;   //            2.if A have sent request to B then B cannot send to A agian

&#x20;   const exisitingConnectionRequest = await ConnectionRequest.findOne({

&#x20;// . The first condition: { fromUserId, toUserId }

// This is shorthand for { fromUserId: fromUserId, toUserId: toUserId }.



// It looks for documents where the sender is your fromUserId variable and the receiver is your toUserId variable.



// 2. The second condition: { fromUserId: toUserId, toUserId: fromUserId }

// This looks for documents where the roles are swapped: the sender is the toUserId and the receiver is the fromUserId.

&#x20;       $or: \[

&#x20;           {fromUserId,toUserId},

&#x20;           {fromUserId:toUserId,toUserId:fromUserId},

&#x20;       ]

&#x20;   });



&#x20; 

&#x20;   if(exisitingConnectionRequest){

&#x20;       throw new Error("Conncetion already exsist");

&#x20;   }



&#x20;   //Creating an instance connectionRequest 

&#x20;   const connectionRequest = new ConnectionRequest({

&#x20;       fromUserId,

&#x20;       toUserId,

&#x20;       status

&#x20;   });



&#x20;   const data = await connectionRequest.save();



&#x20;   res.json({

&#x20;       message:`${req.user.firstName} is ${status}`,

&#x20;       User: toUser

&#x20;   });





&#x20;  } catch (err) {

&#x20;   res.status(400).send("Error: "+err.message);

&#x20;  }

});



module.exports = {requestRouter};







```





##### **Indexes in mongoDb:-**

&#x20;                    

**https://www.mongodb.com/docs/manual/indexes/ -->** learn about the what is index and use case



###### **✅ *Advantages of Using Indexes***

The primary benefit of an index is efficiency. Without an index, MongoDB must perform a collection scan, checking every single document in a collection to find a match—similar to searching for a word in a book by reading every page.



Dramatically Faster Queries: Indexes are special data structures that store a small, ordered portion of the data. This allows MongoDB to quickly locate the relevant documents, reducing query time from potentially seconds to milliseconds. For example, an index on a name field can speed up a query by 300% or more.



Faster Sorting and Reduced Resource Usage: Because indexes store data in a sorted order, they can also return sorted results much more efficiently. By limiting the number of documents that need to be examined, indexes reduce disk I/O and CPU usage, leading to overall better server performance.



Support for Unique Constraints: You can create a unique index to ensure that no two documents in a collection have the same value for a given field (or combination of fields), which is crucial for maintaining data integrity.



###### ❌ ***Disadvantages of Creating Indexes***

While indexes make reads faster, they make writes slower. This is the most important drawback to consider.



Write Performance Overhead: Every time you insert, update, or delete a document, MongoDB must also update every index on that collection. This additional work slows down write operations. The more indexes you have, the slower the writes will be. In one real-world case, removing 12 unnecessary indexes improved write query execution time by 25-30%.



Increased Storage and Memory Usage: Each index consumes disk space. In some cases, the total size of all indexes can be larger than the data itself. Furthermore, for optimal performance, indexes are typically stored in RAM. More indexes mean more pressure on memory, which can lead to performance issues if the system runs out of RAM.



Risk of "Over-Indexing": Creating indexes you don't need is a common pitfall. Wildcard indexes, for example, are flexible and can index every field in a document, but their size can "explode" and become a serious bottleneck.



###### **Compound Indexes:- https://www.mongodb.com/docs/manual/core/indexes/index-types/index-compound/#std-label-index-type-compound**





###### 1\. When to use a Single-Field Index:-

Use a single-field index when your queries filter, sort, or group by exactly one field.



Best use cases:



Highly selective queries: You are looking for a single, unique document. (e.g., find({ email: "john@doe.com" }) or find({ order\_id: "A123" })).



Lookup by a foreign key: You frequently query by a user\_id or product\_id to fetch related documents.



Simple sorting: You only need to sort results by one field (e.g., sort({ created\_at: -1 })).



Example:



```javascript

// Query: Find all active users

db.users.find({ status: "active" })



// Index to create:

db.users.createIndex({ status: 1 })

```

Why this works: The index narrows down the collection to only "active" documents instantly, skipping the rest.



###### 2\. When to use a Compound Index (Multiple Fields):-

Use a compound index when your query references two or more fields in the filter, or when you combine a filter with a sort.



Best use cases:



Queries with multiple filters: You are searching by city AND age.



Filter + Sort combinations: You are filtering by status but sorting by created\_at.



Covered Queries: You want the index to contain all the fields requested in the query so MongoDB never has to look at the actual document (ultra-fast).



The ESR Rule (Crucial for Compound Indexes):

When building a compound index, order matters. Follow the Equality, Sort, Range rule:



Equality fields first (exact matches: status: "active").



Sort fields second (fields you order by: created\_at).



Range fields last (fields with $gt, $lt, $in: age: { $gt: 18 }).



Example 1 (Filter + Sort):



```javascript

// Query: Find active users, newest first

db.users.find({ status: "active" }).sort({ created\_at: -1 })



// Correct Compound Index (Equality first, Sort second):

db.users.createIndex({ status: 1, created\_at: -1 })

//Why: This index finds "active" users instantly and returns them in sorted order without performing an in-memory sort (which is expensive).

**```**

###### **AND THAT'S IT ALL FOR THIS LECTURE FAAAA**



