//There are Severe complecation on this way but we also have a simpler way 
//provided by the express.js framwork of node (it is the E of MERN)

const http = require("node:http");

// Creating a server instance (instace = a living object from a class like http.server from http)
//this has a callback function that act as a listner which will triger every time someone makes a request.

//(req , res)
//req (Request): Will Contains data about the incoming call (like the URL or headers).
// res (Response): This is what you use to send data back to the user.
const server = http.createServer( (req ,res) =>
    {
        //req.url is a property of the Request object that tells the server 
        //exactly which path or address the user is trying to access after the domain name.
        if(req.url === "/getMessyThought"){
           return res.end("Ronaldo is the real G.O.A.T"); //return will prevent the collision from last end
        }
        //res.end will tell the server that everything has been sent
        //and will finish the connection with the given string
        res.end("Hey love the flow");
}
);

// This starts the server and tells it to "stay awake" and listen for 
// incoming traffic on Port 7869.
server.listen(786);

