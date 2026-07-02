Episode-10 - Authentication, JWT \& Cookies



##### **What is a JWT?**

A JWT is a string of text that looks like a long jumble of letters, numbers, and dots (e.g., eyJhbGciOiJIUzI1NiIs...).



It is a self-contained digital passport. It carries all the information a server needs to know about a user (like their User ID and role) inside the token itself. Because it is cryptographically signed, the server can trust that the token hasn't been tampered with.



###### **How JWT Authentication Works (The Flow):-**



Imagine you are checking into a hotel.



Login (Reception): You give your username and password to the server.



Issuance (Room Key): The server verifies your credentials. It creates a JWT containing your user ID and role, signs it with a secret key, and sends it back to your browser.



Storage (Wallet): Your browser stores this token (usually in localStorage or a cookie).



Request (Opening the Door): Every time you want to access a restricted page (e.g., /dashboard), your browser automatically sends the JWT in the Authorization header of the HTTP request.



Verification (Doorman): The server receives the request. It grabs the JWT, checks the signature using its secret key. If the math checks out and the token hasn't expired, the server trusts the data inside it and sends you the dashboard.



###### **The Most Important Rule: Statelessness:-**



The biggest difference between JWT and "Session Cookies" is where the data is stored.



Session Cookies (Old Way): The server stores your session data in its own database or memory. When you make a request, the server looks up your ID in its database. Problem: If you have 1 million users, the server has to remember 1 million sessions. If you scale to 10 servers, you have to share that memory between all of them.



JWTs (New Way): The server stores nothing. It just gives you the token and forgets about you. When you come back, the server reads the token, verifies the signature, and instantly knows who you are. This makes scaling web apps incredibly easy.



###### **cookie-parser:-** 

To read the cookie in code we need a library called cookie parser developed by expressjs

&#x20;      cookie-parser intercepts this raw text string before it reaches your main route handler and translates it into a clean JavaScript object.

you will get undefined if you will not use it.

###### 

###### **Json web tocken:-**

&#x20;                npm install jsonwebtoken





```javascript



//login API

app.post("/login", async (req,res) => {



&#x20;   try {

&#x20;       const {email , password} = req.body;



&#x20;       //validaitng email

&#x20;       const user = await User.findOne({email: email});



&#x20;       if(!user){

&#x20;           throw new Error("Invalid credentials");

&#x20;       }



&#x20;       //validating the password

&#x20;       const isPasswordValid = await bcrypt.compare(password, user.password);



&#x20;       if(isPasswordValid){

&#x20;           //create a JWT tocken

&#x20;           //1st para is the unique user id and second para is the password by the dev which no one knows

&#x20;           const tocken = await jwt.sign({\_id: user.\_id} , "DEV@meet$786");

&#x20;           



&#x20;           //add the token in the cookie and send the response back

&#x20;           //para 1: name of he cookie and para 2: the jwt tocken

&#x20;           res.cookie("tocken", tocken);



&#x20;            res.send("Login successful!");

&#x20;       }else{

&#x20;            throw new Error("Invalid credentials");

&#x20;       }



&#x20;   } catch (err) {

&#x20;       res.status(400).send("Error: "+ err.message);

&#x20;   }

});



//pofile

app.get("/profile", async (req,res) => {

&#x20;   try{

&#x20;       const cookies = req.cookies;

&#x20;       const {tocken} = cookies;



&#x20;       if(!tocken){

&#x20;           throw new Error("Invalid tocken");

&#x20;       }



&#x20;       //validating the tocken

&#x20;       const decodeMessage = await jwt.verify(tocken,"DEV@meet$786");

&#x20;       const {\_id} = decodeMessage;

&#x20;       console.log("Logged In user is: "+\_id);



&#x20;       const user = await User.findById(\_id);

&#x20;        if(!user){

&#x20;           throw new Error("User does not exist");

&#x20;       }

&#x20;       res.send(user);



&#x20;       res.send("Response");

&#x20;   }

&#x20;   catch (err) {

&#x20;       res.status(400).send("Error: "+ err.message);

&#x20;   }

&#x20;   

});





```









