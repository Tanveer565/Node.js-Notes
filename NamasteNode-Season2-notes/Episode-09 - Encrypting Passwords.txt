Episode-09 - Encrypting Passwords

Improving the signup API with data validation and password encryption to make sure that no user can insert a malicious code into our backend.
 
Creating a utils folder(helper folder) and creating a validation file for the checks in which I will write the validations on api level for each field

Encrypting the password:-

bcrypt Library - Short Overview
bcrypt is a password hashing library designed specifically for securely storing passwords. It's one of the most widely used solutions in Node.js applications.

Key features:

Adaptive hashing - Can be made slower/faster as hardware improves

Salt included - Automatically generates and stores salt in the hash

Resistant to brute-force - Intentionally slow algorithm

Industry standard - Used by millions of apps worldwide

.hash Method :-
How .hash() Method Works
The .hash() method takes two parameters and returns a hashed string:

Parameters:
password (string) - The plain text password to hash

saltRounds (number) - The cost factor (higher = more secure but slower)

What happens internally:
Step 1: Generate Salt

Creates a random salt (22 characters, base64 encoded)

Salt ensures same password produces different hashes

Step 2: Apply Salt Rounds

Uses Blowfish cipher to hash the password with the salt

Repeats the hashing process 2^saltRounds times

Each round makes it exponentially harder to crack


Code:-

```javascript
//signup
app.post("/signup",async (req,res) => {


    try{ 
        //validation of data
        validateSignUpData(req);

        const {firstName,lastName,email,password} = req.body;

        //Password encryption by .hash 
        const passwordHash = await bcrypt.hash(password,10);
        
    //Create a new instance of the model User to add new user info
    const user = new User({
        firstName,
        lastName,
        email,
        password:passwordHash,
    });

         //The save function returns a promise so you have to use await
         await user.save();
         res.send("User Added Successfully!");
    }
    catch(err){
        res.status(400).send("Error: "+err.message);
    }
});

```

Login API:-

```javascript
app.post("/login", async (req,res) => {

    try {
        const {email , password} = req.body;

        //validaitng email
        const user = await User.findOne({email: email});

        if(!user){
            throw new Error("Invalid credentials");
        }

        //validating the password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(isPasswordValid){
             res.send("Login successful!");
        }else{
             throw new Error("Invalid credentials");
        }

    } catch (err) {
        res.status(400).send("Error: "+ err.message);
    }
});

```

