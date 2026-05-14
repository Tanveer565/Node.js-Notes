Episode: 03

### Episode 3: Creating our Express Server



\##npm init to create a json config file :- index file for a project which tells you about the project meta data of the project

1. npm init (The Manual Setup)
When you run this, npm starts an interactive questionnaire in your terminal. It will ask you for:

Package name: (Defaults to your folder name)

Version: (Defaults to 1.0.0)

Description: A short summary of your project.

Entry point: (Defaults to index.js)

Test command:

Git repository:

Keywords:

Author:

License: (Defaults to ISC)



&#x20;     **metadata** is often defined as "data about data." It provides a summarized description of a file or piece of information to make it easier to find, manage, and use.



\##created an src folder and app.js file inside it which will be the main file of our project. here we initialize our project



\##Now we have to built a server so we can accept incoming request and we will do it using the node web framework express.js



npm instal express 



Now all the code of express js has come in our project with one file package-lock.json 



All dependencies are installed in Node-module



dependencies = express (means our project is dependent on express)

express too have many dependencies and all the dependency has came in module



Note :- so if you install any lib so all the dependency will come inside node-module. node-module are very heavy as it have all the code and all the dependency.



Package.json :-



^4.x.x -> caret it include the functionality to upgrade our project into any latest version of 4.x.x automatically (no upgrade in case of major change)



what does it mean by -> 5.2.1 

1 = patch:(a very small change or bug fix) if they do it then 5.2.2



2 = minor change (minor feature or change) so version = 5.3.1

&#x20;note: this type of change on new version can work on any 5.x.x version



5 = major(braking changes) so if version will = 6.2.1

Note:- it can break your existing application so you have to update





Package-lock.json :-



It file is a manifest that records the exact version of every package installed in your node-modules tree.



nodemon:-



install nodemon into your system  it can autometicaly refresh the server whenever you changes some code so you do not have to stop and re run again and again.



Use : nodemon app.js

sudo npm I -g nodemon

\-g = on global level(now it will work on every project)



**Npm Script :- a shortcut or an alias.**



You also do not have to use node or nodemon app.js you can actually set some key on the package.json file 

"scripts": {

&#x20;   "start": "node src/app.js",

&#x20;   "dev": "nodemon src/app.js"

&#x20; }



now if you will do npm run start = node src/app.js

&#x20;                  npm run dev = nodemon src/app.js



##### Code :-



```javascript

//Creating a Server With Express.js



const express = require("express");



//Crating an express app for server

const app = express();



//request handlers

//Handling the incoming request

// /test = giving a route

app.use("/admin",(req,res) => {

&#x20;   res.send("The page is only for admin!");l

});



app.use("/test",(req,res) => {

&#x20;   res.send("Hello From the Server!");

});



app.use("/",(req,res) => {

&#x20;   res.send("Hello from the dashBoard");

});





//The app is running on the port 3000

app.listen(3000,()=>{

&#x20;   console.log("The server is successfully listening on port 3000... ")

});



```



