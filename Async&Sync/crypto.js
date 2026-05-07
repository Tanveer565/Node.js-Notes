// // What is crypto ?
// The crypto module is one of the core modules provided by Node.js, similar to 
// other core modules like (compressing files). https ,fs (file system), and zlib (used for)

// These core modules are built into Node.js, so when you write require('crypto') , 
// you're importing a module that is already present in Node.js.
// You can also import it using 

// require('node:crypto') to explicitly indicate that itʼs a 
// core module, but this is optional.

const crypto = require('node:crypto');

// It is an async way so the js v8 just will offloads it to the node libuv and then libuv will
//resgister a callback and do the work by os

crypto.pbkdf2("password", "salt", 5000000 , 50 , "sha512",
    (err , key) => console.log("1 - The key is generated")
);


//It happnens Synchronously so it will actually block the main thread and the 
//have to wait here for it to be execute.
// crypto.pbkdf2Sync("password", "salt", 500, 50 , "sha512");

// console.log("The second key is generated first");

// The 5 Key Ingredients
// When you use crypto.pbkdf2(), you have to provide these 5 things:

//1  Password: The plain text string the user typed.

//2  Salt: A random string unique to that user. This prevents "Rainbow Table" attacks (where hackers use a pre-made list of common password hashes).

//3  Iterations: How many times the hashing happens. In 2026, the standard is usually 600,000+. This makes the process purposely slow to stop brute-force bots.

//4  Key Length: How long you want the final key to be (e.g., 32 or 64 bytes).

//5  Digest: The underlying math algorithm used (usually sha512 or sha256).