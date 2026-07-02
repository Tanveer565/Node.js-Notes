Express Error Handling:-



Note :- the file contains info about the automatic error handling of express



Error Handling refers to how Express catches and processes errors that occur both synchronously and asynchronously. Express comes with a default error handler so you don’t need to write your own to get started.



###### Catching Errors:-



It’s important to ensure that Express catches all errors that occur while running route handlers and middleware.



Errors that occur in synchronous code inside route handlers and middleware require no extra work. If synchronous code throws an error, then Express will catch and process it. For example:



```javascript

app.get('/', (req, res) => {

&#x20; throw new Error('BROKEN') // Express will catch this on its own.

})

```



###### Async Error:-



For errors returned from asynchronous functions invoked by route handlers and middleware, you must pass them to the next() function, where Express will catch and process them. For example:



```javascript



app.get('/', (req, res, next) => {

&#x20; fs.readFile('/file-does-not-exist', (err, data) => {

&#x20;   if (err) {

&#x20;     next(err) // Pass errors to Express.

&#x20;   } else {

&#x20;     res.send(data)

&#x20;   }

&#x20; })

})





```



Starting with Express 5, route handlers and middleware that return a Promise will call next(value) automatically when they reject or throw an error. For example:



**```javascript**



**app.get('/user/:id', async (req, res, next) => {**

&#x20; **const user = await getUserById(req.params.id)**

&#x20; **res.send(user)**

**})**



**```**



**Note :- If getUserById throws an error or rejects, next will be called with either the thrown error or the rejected value. If no rejected value is provided, next will be called with a default Error object provided by the Express router.**



##### The next():-

In Express, middleware functions receive a third argument next, which is a function you call to pass control to the next middleware in the chain.



###### What happens when you pass something to next():-



You call...  	Express interprets as...	What Express does



next()	        Normal flow	                Proceed to the next middleware/route handler



next('route')	Special skip	                Skip remaining middleware in current router and jump    

&#x20;                                               to next matching 

next(error)	An error occurred	        Skip all normal middleware/route handlers and jump 

&#x20;                                               straight to error-handling middleware



The crucial part: anything except 'route' = error

If you pass a string that is not 'route', or a number, or an object, or any value at all (including null, false, 0, etc.), Express treats it as an error.



```javascript

// All of these trigger error-handling mode:

next('something wrong');

next(403);

next(new Error('Database failed'));

next(null);    // yes, even null

next(0);

```



Why does this matter?

Once Express goes into "error mode", it skips all remaining normal middleware and route handlers – even if they come later in the chain. Instead, it looks for middleware defined with four parameters: (err, req, res, next).



```javascript

javascript

// Normal middleware – skipped when next(error) is called

app.use((req, res, next) => {

&#x20; console.log('This will NOT run if an error happened earlier');

});



// Error-handling middleware – runs when next(error) is called

app.use((err, req, res, next) => {

&#x20; console.error('Caught error:', err);

&#x20; res.status(500).send('Something broke');

});



//Visual example



app.use((req, res, next) => {

&#x20; console.log('1. This runs');

&#x20; next(); // normal

});



app.use((req, res, next) => {

&#x20; console.log('2. This runs');

&#x20; next('something went wrong'); // triggers error mode

});



app.use((req, res, next) => {

&#x20; console.log('3. This will NEVER run'); // skipped

});



app.get('/', (req, res) => {

&#x20; res.send('This will NEVER send');

});



// Error handler

app.use((err, req, res, next) => {

&#x20; console.log('4. Error caught:', err);

&#x20; res.status(500).send('Server error');

});



```



If the callback in a sequence provides no data, only errors, you can simplify this code as follows:



```javascript

app.get('/', \[

&#x20; function (req, res, next) {

&#x20;   fs.writeFile('/inaccessible-path', 'data', next)

&#x20; },

&#x20; function (req, res) {

&#x20;   res.send('OK')

&#x20; }

])

```

In the above example, next is provided as the callback for fs.writeFile, which is called with or without errors. If there is no error, the second handler is executed, otherwise Express catches and processes the error.



You must catch errors that occur in asynchronous code invoked by route handlers or middleware and pass them to Express for processing. For example:



```javascript

app.get('/', (req, res, next) => {

&#x20; setTimeout(() => {

&#x20;   try {

&#x20;     throw new Error('BROKEN')

&#x20;   } catch (err) {

&#x20;     next(err)

&#x20;   }

&#x20; }, 100)

})

```



The above example uses a try...catch block to catch errors in the asynchronous code and pass them to Express. If the try...catch block were omitted, Express would not catch the error since it is not part of the synchronous handler code.



You could also use a chain of handlers to rely on synchronous error catching, by reducing the asynchronous code to something trivial. For example:



```javascript

app.get('/', \[

&#x20; function (req, res, next) {

&#x20;   fs.readFile('/maybe-valid-file', 'utf-8', (err, data) => {

&#x20;     res.locals.data = data

//if this async func got error our next will handle

&#x20;     next(err)

&#x20;   })

&#x20; },

&#x20; function (req, res) {

//if this sync func got error Express itself will handle

&#x20;   res.locals.data = res.locals.data.split(',')\[1]

&#x20;   res.send(res.locals.data)

&#x20; }

])

```

The above example has a couple of trivial statements from the readFile call. If readFile causes an error, then it passes the error to Express, otherwise you quickly return to the world of synchronous error handling in the next handler in the chain. Then, the example above tries to process the data. If this fails, then the synchronous error handler will catch it. If you had done this processing inside the readFile callback, then the application might exit and the Express error handlers would not run.



**Note:-Whichever method you use, if you want Express error handlers to be called in and the application to survive, you must ensure that Express receives the error.**

