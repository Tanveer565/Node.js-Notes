Episode:05 Routing And MiddleWares



Q: What if here is no response in the router?

A: 1. The "Hanging" Request

&#x20;     When a request hits your server, Express opens a connection. If your code finishes executing the logic but never calls a response method, the server stays "silent." The browser will show a spinning loading icon for about 2 minutes (the default timeout) before finally giving up and showing a "Gateway Timeout" or "Empty Response" error.



```javascript



app.use("/user", (req,res) =>{

&#x20;   console.log("This is the first request!");

&#x20;   //No response

})



```



##### Next() :-



in express for a single route there can be a multiple route handlers as many as you want but they should use the function next to pass the reqest to the next route 





```javascript

//eg.1

app.use("/user", (req,res,next) =>{

&#x20;   console.log("This is the first route handler!!");

&#x20;   next();

&#x20;   //No response

},(req,res) =>{

&#x20;   console.log("This is the Second route handler!!");

&#x20;   res.send("The respons!");

});



```



Bu if you pass the response two times like this in eg.2 then there will a error because the response has been already send and the tcp connection is closed so error will occur. but you will still get the response meanwhile the error will be in the terminal.



```javascript

//eg.2



app.use("/user", (req,res,next) =>{

&#x20;   console.log("This is the first route handler!!");

&#x20;   res.send("The respons!");

&#x20;   next();

&#x20;   res.send("The respons!"); //in this case also

},(req,res) =>{

&#x20;   console.log("This is the Second route handler!!");

&#x20;   res.send("The respons2!");

});





```



You can pass as many route handler for one route as you want but then you have to use next for every handler expect the last handler because if you do use next even at the last it throw cannot get error as there is no route handler.



```javascript



app.use("/user", (req,res,next) =>{

&#x20;   console.log("This is the 1st route handler!!");

&#x20;   next();

},(req,res,next) =>{

&#x20;   console.log("This is the 2nd route handler!!");

&#x20;   next();

},(req,res,next) =>{

&#x20;   console.log("This is the 3rd route handler!!");

&#x20;   next();

},(req,res,next) =>{

&#x20;   console.log("This is the 4rt route handler!!");

&#x20;   res.send("this is a great response");

});



//You can even group thses handler into an array as you want



//like { rh1, \[rh2,rh3] rh4}



```



You can even use the next function for the complete separate router with same or differ paths something like that



```javascript

app.use("/",(req,res,next) => {

&#x20;   next();

});



app.use("/user", 

&#x20;   (req, res, next) => {

&#x20;       console.log("handling /user route");

&#x20;       next(); // <--- THIS is the key to reaching the next function

&#x20;   },

&#x20;   (req, res, next) => {

&#x20;       res.send("route handle at 2nd");

&#x20;       // The chain ends here because res.send() was called.

&#x20;   },

&#x20;   (req, res, next) => {

&#x20;       // This will NEVER be called because the previous one sent a response.

&#x20;       res.send("route handle at 3rd");

&#x20;   }

);



```



Q: how the express  handles request behind the scenes ?

A: Behind the scenes, Express operates as a linear pipeline of functions. When a request hits your server, Express doesn't just "jump" to the right route; it passes that request through every piece of middleware you've defined, one by one, in the exact order you wrote them.



###### middleware :

In short, middleware is a function that sits between the Request coming in and the Response going out. It acts like a checkpoint or a "middleman" that can inspect, modify, or even stop the request before it reaches your final route handler.

in chain of route handler every route handler at the middle without response.



###### route handler: 

the final one that gives the response.



Note: Express handles or takes a request and goes throw the middleware chain it goes one after the and finally

give the response from the route handler that is giving some response this is the work of express. and in case when it does not find a route handler in chain after some next it will throw an error, and if there is no response even at the end the request will just hanging out there.



###### How middleware is important :-



Now here middleware work we are basically checking for admin in one midleware and then giving next and then no need to write code again and code will be passes through the middlewares.



also if suppose there are multiple paths for admin/… then if you have put the auth middleware at very first   

like for only /admin and the request came for the /user then all paths related to the admin will gonna be ignored.



Now for the auth function in the code I have created it in the different folder named middleware/auth.js and now, I will export it so I can use it wherever I wan to.



##### Code:-

```javascript



&#x20;   //logic to check if the useer is authorized or if the request is authorised

&#x20;   const tocken = "xyz";

&#x20;   const isAuthorized = tocken === "xyz";

&#x20;   if(!isAuthorized){

&#x20;       res.status(401).send("Unauthorised Request");

&#x20;   }

&#x20;   else{

&#x20;       next();

&#x20;   }

};

module.exports = {adminAuth};



const express = require("Express");

const { MongoNotConnectedError } = require("mongodb");





const app = express();





const { adminAuth,userAuth } = require("./middlewares/auth");





//now he code checks he auth here but you can make

//make path for user even without being checked like 

// for user login

app.post("/user/login",(req,res) => {

&#x20;   res.send("This is the login page!")

})



//making for user

app.get("/user",userAuth,(req,res,next) => {

&#x20;   //only go to this route if auth is valid

&#x20;   res.send("user Send");

});



//use = handling all middleware for any http method.



//this middleware will only get checked if the admin is authorise otherwise

//it will not even reach till here and just throw an error.

app.use("/admin",adminAuth);



app.get("/admin/getalldata",(req,res) => {

&#x20;   //only go to this route if auth is valid

&#x20;   res.send("All data Send");

});



app.get("/admin/deleteuser",(req,res) => {

&#x20;   res.send("Deleted the user");

});





app.listen(1313,() => {

&#x20;   console.log("The Server is listening on the port 1313");

});





```





