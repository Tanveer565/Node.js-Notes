//There are some seperate module in node.js to use
const Https = require("node:https");
const fs = require("fs");

console.log("The terrorist Willium Butcher: ");

fs.readFile("./file.txt" , "utf8" , (err , data) => 
    console.log(data)
);

// Https.get("https://dummyjson.com/products/1" , (res) =>
//     console.log("Fetched data Success")
// );
setTimeout(() => 
console.log("It took me 3 seconds to be executed")
, 3000);

console.log("The Member and the leader of the boys");


