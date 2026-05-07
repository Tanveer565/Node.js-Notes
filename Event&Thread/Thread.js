
// Q-- Is Node Single Threaded or Multi Theaded ?
// It depends wheather you are performing Sync or Async

// If you are doing the Sync works the node is single threaded as it
// only use one thread to run whole code.

//But if you do Async works then the v* engine offloads the async work
//to lib uv then it is the lib uv's job to to give a thread to that work
//and then occupying the thread completely until the work is done
//This makes node js multi-threaded.

//Native OS Offloading: For things like network requests (epoll/kqueue), the OS itself handles the task. Node just waits for the notification.
// The Thread Pool (Worker Threads): Whenever you perform tasks like file system (fs) operations, DNS lookups 
// Domain Name System), or cryptographic methods, libuv uses the thread pool.

// If you're dealing with synchronous code, Node.js is single-threaded. But if you're 
// dealing with asynchronous tasks, it utilizes libuv's thread pool, making it multi
// threaded. the order of execution is not gauranteed over here which thread executes first will win

//------------------------------------------------------------------------------------------------------------------

// In Node.js, the default size of the thread pool is 4 threads: UV_THREADPOOL_SIZE=4

// Now, suppose you make 5 simultaneous file reading calls. What happens is that 4 
// file calls will occupy 4 threads, and the 5th one will wait until one of the threads is free


const crypto = require('crypto');

crypto.pbkdf2("password", "salt", 5000000 , 50 , "sha512",
    (err , key) => console.log("1 - The key is generated")
);
crypto.pbkdf2("password", "salt", 5000000 , 50 , "sha512",
    (err , key) => console.log("2 - The key is generated")
);
crypto.pbkdf2("password", "salt", 5000000 , 50 , "sha512",
    (err , key) => console.log("3 - The key is generated")
);
crypto.pbkdf2("password", "salt", 5000000 , 50 , "sha512",
    (err , key) => console.log("4 - The key is generated")
);
crypto.pbkdf2("password", "salt", 5000000 , 50 , "sha512",
    (err , key) => console.log("5 - The key is generated")
);

