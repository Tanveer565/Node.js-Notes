Episode07 - Diving into the APIs

JSON :-
        JSON (JavaScript Object Notation) is a lightweight data-interchange format. It is easy for humans to read and write. It is easy for machines to parse and generate. It is based on a subset of the JavaScript Programming Language Standard ECMA-262 3rd Edition - December 1999. JSON is a text format that is completely language independent but uses conventions that are familiar to programmers of the C-family of languages, including C, C++, C#, Java, JavaScript, Perl, Python, and many others. These properties make JSON an ideal data-interchange language.



###### JSON Vs JavaScript Object:-



JSON and JavaScript Objects are both used to represent data in JavaScript, but they are designed for different use cases. JSON focuses on data exchange, while JavaScript Objects are meant for working with data inside programs.



JSON is a text-based format used for storing and transmitting data, whereas JavaScript objects exist in memory and are used for program logic.



JSON has strict syntax rules (no functions, comments, or trailing commas), while JavaScript Objects are more flexible.



JavaScript Objects can include methods and complex logic, but JSON is limited to pure data only.









Note :- If you get error while connecting to the cluster try setting the IP 0.0.0./0



Sending a User data from request:-



in postman there is a body section where in raw - json you can send json data from the postman so just created some json data and send it using post



express.json: - The express.json() is a built-in middleware in Express. It helps your app read JSON data sent from the client (like in POST or PUT requests) and makes it available in req.body. Without it, Express cannot understand JSON data in requests.



\##difference between patch and put



###### Code:-

&#x20;

```javascript



// It takes the raw JSON string sent by the client (which is just a bunch of text traveling over the network)

// and converts it into a standard JavaScript object.

app.use(express.json());



//signup

app.post("/signup",async (req,res) => {

&#x20;   //Create a new instance of the model User to add new user info

&#x20;   //taking the json data from req using req.body

&#x20;   const user = new User(req.body);

&#x20;   try{ 

&#x20;        //The save function returns a promise so you have to use await

&#x20;        await user.save();

&#x20;        res.send("User Added Successfully!");

&#x20;   }

&#x20;   catch(err){

&#x20;       res.status(400).send("Error in saving the user!"+err.message);

&#x20;   }

});



//user 

app.get("/user", async (req,res) => {



&#x20;   const userEmail = req.body.email;

&#x20;   try{



&#x20;       //If you only want one user(this function not give an array)

&#x20;   // const user = await User.findOne({email: userEmail});



&#x20;   //It gives the one document by his unique id (uses findOne as middleware)

&#x20;   // const user = await User.findById({email: userEmail});





&#x20;   const users = await User.find({email: userEmail});

&#x20;   throw new Error("Validation Failed: Email is required!");



&#x20;   //if no email matches then and empty array will be returned send error

&#x20;   if(users.length === 0){

&#x20;       res.status(404).send("User not Found!");

&#x20;   }

&#x20;   else{

&#x20;       res.send(users);

&#x20;   }

&#x20;   }

&#x20;   catch{

&#x20;       res.status(404).send("Something went wrong");

&#x20;   }



});



//Feed API - Get /feed - Get all the user from the dataBase

app.get("/feed" , async (req,res) => {



&#x20;   //The empty object for find all

&#x20;   try{

&#x20;   const users = await User.find({});

&#x20;   res.send(users);

&#x20;   }

&#x20;   catch{

&#x20;       res.status(404).send("Something Went Wrong");

&#x20;   }



});



//Delete Api - Delete user by id

app.delete("/deleteuser" , async (req,res) => {



&#x20;   const userId = req.body.\_id;



&#x20;   try{

&#x20;       //deleting user by his id

&#x20;       const user = await User.findByIdAndDelete(userId);

&#x20;       res.send("User Deleted Successfully!");

&#x20;   }

&#x20;   catch{

&#x20;       res.status(400).send("Something Went Wrong!")

&#x20;   }



});



//patch Api - TO Update the data of the user by id

app.patch("/user", async (req,res) => {

&#x20;   const updateData = req.body;

&#x20;   //taking the userId from the body

&#x20;   const userId = req.body.userId;



&#x20;   try{

&#x20;       //Matching the userId in the DB by checking every \_id

&#x20;       //And there are lot more options to use after the update 

&#x20;       const user = await User.findByIdAndUpdate({\_id: userId} , updateData, {

&#x20;           returnDocument: 'after'

&#x20;       });

&#x20;       console.log(user);



&#x20;       res.send("User updated successfully");

&#x20;   }

&#x20;   catch(err){

&#x20;       res.status(400).send("Something went wrong");

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

