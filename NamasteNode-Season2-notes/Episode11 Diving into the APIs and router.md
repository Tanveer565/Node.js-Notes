Episode11 Diving into the APIs and express Router



First I have created the file of api list where I listed all the api that needs to be made for the devmeet and then I substituted all the api in the grouos of express routers.



###### Express Router - The Simple Explanation

A router in Express is an isolated mini‑application that groups middleware and route handlers. It behaves like regular middleware, so you can attach it to an app (or another router) with app.use() or router.use()



Why Use Router?

Instead of putting ALL your routes in one file (which becomes a mess), you can split them into logical groups:



**Benefits of Using Router:-**



Organization - Keep related routes together

Reusability - Use same router in multiple apps

Modularity - Easy to maintain and scale

Cleaner Code - No 1000-line app.js files

Middleware per Route - Apply auth, validation per group



List of DEVMEET API:-



\# DEVMEET API LIST



API



\## authRouter

&#x20; - Post /signup

&#x20; - Post /login

&#x20; - Post /logout



\## profileRouter

&#x20; - get   /profile/view

&#x20; - patch /profile/edit

&#x20; - patch /profile/password



\## connectionRequestRouter

&#x20; - Post /request/interested/userId:

&#x20; - Post /request/ignored/userId:

&#x20; - get  /request/review/accepted/requestId:

&#x20; - get  /request/review/rejected/requestId:



\## uesrRouter

&#x20; - get  /user/connections

&#x20; - get  /user/reqests

&#x20; - get  /user/feed - gets you the profile of other user on the platform



&#x20; 

To Make The different express router create folder: router and then create different router in different files like : authRouter in auth.js and so on





**Auth Router:-**



```javascript



const express = require("express");

const validateSignUpData = require("../utils/validation");

const bcrypt = require("bcrypt");

const {User,userSchema} = require("../models/user");



const authRouter = express.Router();



//app. = authRouter.



authRouter.post("/signup",async (req,res) => {

&#x20;   try{ 

&#x20;       //Api level validation 

&#x20;       validateSignUpData(req);



&#x20;       const {firstName,lastName,email,password} = req.body;



&#x20;       //Password encryption by .hash 

&#x20;       const passwordHash = await bcrypt.hash(password,10);

&#x20;       

&#x20;   //Create a instance of the model User to add new user info

&#x20;   // User provides ONLY what's needed to create an account

&#x20;   const user = new User({

&#x20;       firstName,

&#x20;       lastName,

&#x20;       email,

&#x20;       password:passwordHash,

&#x20;   });



&#x20;        //The save function returns a promise so you have to use await

&#x20;        await user.save();

&#x20;        res.send("User Added Successfully!");

&#x20;   }

&#x20;   catch(err){

&#x20;       res.status(400).send("Error: "+err.message);

&#x20;   }

});



//login API

authRouter.post("/login", async (req,res) => {



&#x20;   try {

&#x20;       const {email , password} = req.body;



&#x20;       //validaitng email

&#x20;       const user = await User.findOne({email: email});



&#x20;       if(!user){

&#x20;           throw new Error("Invalid credentials");

&#x20;       }



&#x20;       //validating the password

&#x20;       const isPasswordValid = await user.validatePassword(password);



&#x20;       if(isPasswordValid){

&#x20;           //offloading the task oof creating a jwt tocken to the userschema file

&#x20;           const tocken = await user.getJWT();

&#x20;           res.cookie("tocken",tocken,{expires: *new* Date(Date.now() + 7 \* 3600000)} );



&#x20;           res.send("Login successful!");

&#x20;       }else{

&#x20;           throw new Error("Invalid credentials");

&#x20;       }



&#x20;   } catch (err) {

&#x20;       res.status(400).send("Error: "+ err.message);

&#x20;   }

});



module.exports = {authRouter};





//logout API:-

authRouter.post("/logout", async (req,res) => {

&#x20;   res

&#x20;   .cookie("tocken", null, {expires: new Date(Date.now())})

&#x20;   .send("You are logout successfully!!");

});



```



**Profile Router:-**



```javascript

const express = require("express");

const {userAuth} = require("../middlewares/auth");

const {User,userSchema} = require("../models/user");

const {validateEditProfileDate,validateNewPassword} = require("../utils/validation");

const { ListCollectionsCursor } = require("mongodb");

const bcrypt = require("bcrypt");





const profileRouter = express.Router();



//pofile/view API 

profileRouter.get("/profile/view",userAuth ,async (req,res) => {

&#x20;   try{

&#x20;       const user = req.user;

&#x20;       res.send(user);

&#x20;   }catch{

&#x20;       res.status(400).send("Error: "+err.message);

&#x20;   }

});



//profile/edit(update) API

profileRouter.patch("/profile/edit", userAuth, async (req,res) => {



&#x20;   try {



&#x20;       if(!validateEditProfileDate(req)){

&#x20;           throw new Error("Invalid edit request");

&#x20;       }



&#x20;       const loggedInUser = req.user;



&#x20;       Object.keys(req.body).forEach((key) => {loggedInUser\[key] = req.body\[key]});



&#x20;       await loggedInUser.save();



&#x20;       res.send({message: `${loggedInUser.firstName}, your profile updated successfully`,

&#x20;       data: loggedInUser,});



&#x20;   } catch (err) {

&#x20;       res.status(400).send("Error: "+err.message);

&#x20;   }



});



//profile/password API



profileRouter.patch("/profile/password", userAuth, async (req,res) => {



&#x20;   try {



&#x20;   const user = req.user;

&#x20;   const {exsistingPassword , newPassword} = req.body;



&#x20;   const vlaidatePass = await user.validatePassword(exsistingPassword);



&#x20;   if(!vlaidatePass){

&#x20;       throw new Error("Invalid password!!");

&#x20;   }



&#x20;   validateNewPassword(newPassword);



&#x20;   const passwordHash = await bcrypt.hash(newPassword,10);



&#x20;   Object.keys(req.body).forEach((key) => {user.password = passwordHash});



&#x20;   await user.save();





&#x20;   res.cookie("token", null, {expires: new Date(Date.now())});



&#x20;   res.send({message: `${user.firstName}, your password is changed successfully, loggin again with new password`});





&#x20;   } catch (err) {

&#x20;       res.status(400).send("Error: "+err.message);

&#x20;   }

});



module.exports = {profileRouter};





```





**Send request Router:-**



```javascript


const express = require("express");

const {userAuth} = require("../middlewares/auth");



const requestRouter = express.Router();



//sendConnectionRequest

requestRouter.post("/sendConnctionRequest", userAuth, async(req,res) => {

&#x20;   const user = req.user;



&#x20;   res.send(`${user.firstName} ${user.lastName} sent the connction request!!`);



});



module.exports = {requestRouter};




```





**These are all the API that I created and the profile/password API is created without any help so it will be changed if needed**











