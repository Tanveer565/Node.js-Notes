Episode:04 Routing and Request Handlers



Because of the migration from express v4 to v5

Read More about routing on the Documentation(express routing).



At the start we initialize our project on git by using the CMD "git init".

So git is now started tracking all the changes that we have made so far but it tracked around 513 as we have installed the node module so we have to make file named ".gitignore" so whatever file are inside in this module it will be ignored by git and will not be pushed.



Then created a new repo on the GitHub and pushed the code on to the remote GitHub server.



###### Q: should we push our package.json and package-lock.json ?

A: You should always commit both package.json and package-lock.json to your repository.

&#x20;  These files are the blueprints for your project.



package.json:-It Lists the general versions of dependencies you need (e.g., ^18.2.0), And Tells other developers (and the server) what libraries are required to run the app.



package-lock.json:- Locks down the exact version of every single sub-dependency. Ensures that everyone on your team installs the exact same code, down to the last digit.



##### Order of Routes Matter :-



In which order you are structuring routes it matters a lot because if you will not provide the right order your routes may not going to work.



EG: if you put a route of "/" above any other route your code will look at the slash and then just will send the response for this route because once you have written the / it will match the string so it doesn't matter that what you will write after it. But you can even just use something like /:id

but use correct order to prevent bugs



But What if you another path after the slash to give you can do this.



```javascript



newAPP.use("/hello/bro",(req,res) => {

&#x20;   res.send("Broooooooooo!");

});



newAPP.use("/hello",(req,res) => {

&#x20;   res.send("Hello Not to Human!");

});



```

Even if you just write /hello in first line it going to look for hello/bro only



#### HTTP :-



###### What is HTTP?

HTTP (Hypertext Transfer Protocol) is the fundamental protocol used by the World Wide Web to define how messages are formatted and transmitted. It acts as a bridge between your web browser (the client) and the computer holding the website's data (the server).



Think of it as the common language that allows different devices to talk to each other over the internet.



###### The HTTP Protocol: How It Works

HTTP follows a simple Request-Response cycle. It is "stateless," meaning the server doesn't remember who you are from one request to the next unless additional tools (like cookies) are used.



The Request: You type a URL or click a link. Your browser sends an HTTP request to the server.



Processing: The server receives the request, looks for the data (like an HTML file or a database entry), and prepares it.



The Response: The server sends back an HTTP response containing the requested information and a Status Code (like 200 OK or 404 Not Found).



###### Common HTTP Methods

HTTP methods (often called "verbs") tell the server exactly what action to perform on a specific resource. While there are several, these five are the most common in modern development:



Method,              Purpose,         Typical Use Case

GET,                 Retrieve         data,Opening a website or searching for a product.

POST,                Create           data,Submitting a signup form or uploading a file.

PUT,                 Update           data,Changing your profile information (replaces the whole resource).

PATCH,               Partialupdate,   Updating just your email address without changing the rest of your profile.

DELETE,              Removedata,      Deleting a social media post or a file.



###### Anatomy of an HTTP Message



Every request and response consists of three main parts:



1\. The Start Line

Request: Contains the method (GET/POST), the path (/index.html), and the version (HTTP/1.1).



Response: Contains the version and the Status Code (e.g., 200 for success).



2\. Headers

These provide metadata about the message. For example:



Content-Type: Tells the browser if it's receiving HTML, JSON, or an image.



User-Agent: Tells the server which browser is being used.



3\. The Body (Optional)

This contains the actual data being sent.



In a POST request, the body might contain the username and password you typed.



In a Response, the body usually contains the HTML code for the webpage or the data from an API.

\---



\## 5. Common HTTP Status Codes

\* \*\*200 OK:\*\* The request was successful.

\* \*\*301 Moved Permanently:\*\* The resource is now at a different URL.

\* \*\*400 Bad Request:\*\* The server couldn't understand the request.

\* \*\*404 Not Found:\*\* The requested resource does not exist.

\* \*\*500 Internal Server Error:\*\* The server crashed or encountered an error.



##### Postman :-

Postman is a comprehensive platform designed for the entire lifecycle of Application Programming Interfaces (APIs), from initial design and development to testing, documentation, and monitoring. It provides a user-friendly graphical interface that allows developers to interact with APIs without needing to write custom scripts or use terminal commands.



With this we can test our api with different types of methods 



I created a workspace on postman of devmeet and then I created a collection to test the api call on http get.



Then itested some http request with different methods like grt and post which gives the response on using the   app.use but to have a specific response for in router you can use the app.method. Eg. app.get then if you try to use the post it will give you the error cannot post. 



And remember order still matter so do not place the same router with use() before giving it the get() or post().

In Express, app.use("/thanks", ...) acts as a "prefix match." It will trigger for:

/thanks

/thanks/buddy

/thanks/a-million/friend

The "Why" (How app.use works)
app.use is designed for middleware. Because middleware often needs to apply to entire "folders" or sections of a site (like an /admin panel), Express matches any path that starts with the string you provide.

Key Distinctions in Express v5
While your code works for prefix matching, here is how you control it more precisely:

1. Exact Matching
If you only want to respond to /thanks and not /thanks/anything, you should use a specific HTTP method (like GET):


```javascript

//here /thanks will match for all /thanks/anything and will respond for it so for this we can use advance //routing

app.use("/thanks",(req,res) => {

&#x20;   res.send("Friend do not say thanks!");

});



```



##### Query String Routing :-



One-Line Explanations for Symbols:

In the context of routing, especially when using a framework like Express.js for your MERN stack projects, these symbols are used to create Pattern-Based Routes or Regex Routes that match multiple variations of a URL.  



One-Line Explanations for Symbols: Usex them inside regex only

? (Optional): Marks the preceding character or group as optional, matching zero or one occurrence (e.g., /users? matches both /user and /users).



\+ (One or More): Matches one or more occurrences of the preceding character or group (e.g., /a+b matches /ab, /aab, /aaab, etc.).



\* (Wildcard/Any): In basic routing, it acts as a "match anything" wildcard for that specific segment (e.g., /user/\* matches /user/profile or /user/settings).



() (Grouping): Groups characters together to apply operators like ? or + to the entire group rather than a single letter (e.g., /(api)?/v1 matches both /v1 and /api/v1).



Regex Routing Examples:



When you wrap a path in forward slashes /.../, it becomes a Regular Expression route, allowing for complex matching logic.



/a/ (Simple Inclusion): Matches any route that contains the letter "a" anywhere in the path (e.g., /apple, /data, /banana).



/.\*fly$/ (Ending Pattern): Matches any route that ends exactly with the word "fly," regardless of what comes before it (e.g., /butterfly, /dragonfly, but not /flyer).



##### Regex :-

(short for Regular Expression) is a sequence of characters that forms a search pattern. You can think of it as a "supercharged" search-and-replace tool. While a normal search looks for exact matches (like finding "cat" in a sentence), Regex allows you to look for patterns (like finding "any 3-digit number" or "any email address").



##### Code :-



```javascript

const express = require("Express");



const app = express();



//dynamic routing

app.use("/employ/:employid/:employPass",(req,res) => {



&#x20;   //readin the dynamic routes

&#x20;   console.log(req.params);



&#x20;   res.send("Welcome to employ!");

});



// app.use("/employ",(req,res) => {

//     //Reading the userid the queryParam in route handler

//     //this req.query will you the info about the queryparam(userid)

//     const { employId } = req.query;

//     console.log(employId);



//     //for password

//     const { pass } = req.query;

//     console.log(pass);

//     res.send("Welcome to employ!");

// });



//Path Routing mathch syntax

// This route will match any URL that starts with "admin" and is immediately followed by more text.

app.use("/admin:id",(req,res) => {

&#x20;   res.send("Welcome to admin!");

});



//anything that come after path a

app.use(/a/,(req,res) => {

&#x20;   res.send("This is a!");

});


//Version 5 of express now support this insted

//anthing that end with fly

app.use(/.\*fly$/, (req, res) => {

&#x20;   res.send("This is fly!");

});



//Optional replace ment of ?
//the .ext is dynamic undefind and  optional
//Here after typing file.x.y.z x.y :-Express usually captures everything up to the last dot as the filename and the final part as the extension.

app.get('/:file{.:ext}',(req, res) => {

&#x20; res.send('File found');

});



// if no route matched
//It is the replacement of the wildcard /*
//it used a word splat to define any param that comes
//and you can now see it by req.param.splat
app.get('/*splat', async (req, res) => {

&#x20; res.send("Page not found!");

});

//404 Error Handling: It is frequently placed at the very bottom of your route file to catch any requests that didn't match your specific routes and return a "Page Not Found" message.

app.listen(1313,() => {

&#x20;   console.log("The Server is listening on the port 1313");

});

```

Route Array Matching :-

Express allows you to pass an array of strings as the first argument to a route handler, which essentially creates "aliases" for the same logic.

Instead of writing two separate blocks of code, you are telling Express: "If the user visits path A OR path B, run this same function.

Breakdown of the Syntax
['/discussion/:slug', '/page/:slug']: This is an array containing two different path patterns.

:slug: This is a Path Parameter. It acts as a variable that captures whatever is typed in that part of the URL.

req.params.slug: This is how you access the captured value inside your function.

 Why use this? (Real-world Scenario).

 ```javascript
app.get(['/discussion/:slug', '/page/:slug'], async (req, res) => {
  const { slug } = req.params;
  
  // You can check which path was used if you need to:
  if (req.path.startsWith('/discussion')) {
    console.log(`Fetching discussion: ${slug}`);
  } else {
    console.log(`Fetching page: ${slug}`);
  }

  res.status(200).send(`You are viewing the ${slug} content`);
});
```
Imagine you are building a website where a "slug" (a URL-friendly title) could represent either a forum discussion or a static informational page. If the logic for displaying them is very similar—such as fetching data from a database using that slug—using an array keeps your code DRY (Don't Repeat Yourself).
