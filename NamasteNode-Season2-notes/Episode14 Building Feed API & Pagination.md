Episode14 Building Feed API \& Pagination





making our feed API:- 



//plan for API:-

&#x20;       //User A should see all profile on feed Except

&#x20;       // 0. his own profile

&#x20;       // 1. his connections profile

&#x20;       // 2. profile already sent an interested request

&#x20;       // 3. profile he ignored

&#x20;       // 4. setting the limit of num. of user per page





```javascript





//feed api to get all the user

userRouter.get("/feed",userAuth, async (req,res) => {

&#x20;   try {

&#x20;       const loggedInUser = req.user;



&#x20;       //convet the query into an int as it is string

&#x20;       // || 1 = setting default page and limit

&#x20;       const page = parseInt(req.query.page) || 1;

&#x20;       let limit = parseInt(req.query.limit) || 10;



&#x20;       //setting limit

&#x20;       //if limit is > 50 then limit assign to 50

&#x20;       limit = limit > 50 ? 50: limit;

&#x20;       // if(limit > 50){

&#x20;       //     limit = 50;

&#x20;       // }



&#x20;       //calculating skip

&#x20;       // if i am on page 3 the skip should be from user 20 

&#x20;       //that means on page 3 i need 10 user  limit after skipin 20

&#x20;       //if we will do page 3 - 1 \* limit(10) = 20 (then we got 20 which after we have to start )

&#x20;       // page 6 => (6 - 1) \* 10 = 50 skip(50) user will come after 50 



&#x20;       const skip = (page - 1) \* limit;





&#x20;       const connectionRequest = await ConnectionRequest.find({

&#x20;           $or: \[

&#x20;               {fromUserId: loggedInUser.\_id},

&#x20;               {toUserId: loggedInUser.\_id}

&#x20;           ]

&#x20;       })

&#x20;       .select("fromUserId toUserId status");



&#x20;       const hideUserFromFeed = new Set();

&#x20;       // set is a data structure which holds elements like an array but

&#x20;       //it doesn't hold any duplicate



&#x20;       //looping through the connectionRequest



&#x20;       connectionRequest.forEach( (req) =>{

&#x20;           hideUserFromFeed.add(req.fromUserId.toString());

&#x20;           hideUserFromFeed.add(req.toUserId.toString());

&#x20;       });



&#x20;       const user = await User.find({

&#x20;           $and: \[

&#x20;           {\_id: {$nin: Array.from(hideUserFromFeed) }},

&#x20;           {\_id: {$ne: loggedInUser.\_id }},

&#x20;           ],

&#x20;       })

&#x20;       .select(USER\_SAFE\_DATA)

&#x20;       .skip(skip) 

&#x20;       .limit(limit);;



&#x20;       res.json({

&#x20;           Users: user

&#x20;       });



&#x20;   } catch (err) {

&#x20;       res.status(400).send("Error: "+err.message);

&#x20;   }

});





```

&#x20;



###### Using skip and limit:-



/feed?page=1\&limit=10 => 1-10 => .skip(0) \& .limit(10) (this what you will pass in mongo)

/feed?page=2\&limit=20 => 11-20 => .skip(10) \& .linit(10) skip 10 user and bring the next 10



we will gate the page and limit from our query param we will read it and then send the data acc.



The limit() function in MongoDB is used to specify the maximum number of results to be returned. Only one parameter is required for this function.to return the number of the desired result.Data Management



Sometimes it is required to return a certain number of results after a certain number of documents. The skip() can do this job.











