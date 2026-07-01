Episode08



### Data Sanitization \& Schema Validations



DataBase validation and input sensitisation is needed to make our API and app secure and unvenerable.



In our app the api which saves the data into the database should be checked and validated first there are two api signup and patch which takes the data and saves it


Validation types:-

1) In schema : Schema level validation

2) In api : Api level validation






```javascript



const userSchema = new mongoose.Schema({



//Adding checks to the schema

// 1. seting the fiesld fname email pass as required

// 2. making the email unique so no user can have same email or stopping user to create multiple accounts 

//    with the same email id.

// 3. Setting the default for the about

// 4. using validate function to valifate if the gender is correct

&#x20;   firstName: {

&#x20;       type: String,

&#x20;       //It sets the field as mendatory so if the user will not provide it it 

&#x20;       //will be an error

&#x20;       required: true,

&#x20;       //minumum 3 to maximum 30 words are allowed in name

&#x20;       minLength: 3,

&#x20;       maxLength: 30,



&#x20;   },

&#x20;   lastName: {

&#x20;       type: String,

&#x20;   },

&#x20;   email:{

&#x20;       type:String,

&#x20;        required:true,

&#x20;        //Now the field is set to be unique so the duplicate cannot exist in the same database.

&#x20;        unique: true,

&#x20;        //converting capital into lower

&#x20;        lowercase: true,

&#x20;        //triming all the spaces around

&#x20;        trim: true,



&#x20;   },

&#x20;   password: {

&#x20;       type: String,

&#x20;        required:true,

&#x20;   },

&#x20;   age: {

&#x20;       type: Number,

&#x20;       //minimum age should be be 18 otherwise error

&#x20;       min: 18,

&#x20;   },

&#x20;   Gender: {

&#x20;       type: String,

&#x20;       //validate function to validate the given value 

&#x20;       // it does not validate for patch method to update you have to use

&#x20;       // an option in your findidandupdate

&#x20;       validate(value) {

&#x20;           if(!\["male","female","other"].includes(value)){

&#x20;               throw new Error("Gender data is not validated");

&#x20;           }

&#x20;       },

&#x20;   },

&#x20;   photoUrl: {

&#x20;       type: String,

&#x20;       default:"https://img.magnific.com/premium-vector/default-avatar-profile-icon-gray-placeholder-vector-illustration\_514344-14759.jpg?semt=ais\_hybrid\&w=740\&q=80"



&#x20;   },

&#x20;   about: {

&#x20;       type: String,

&#x20;       //Setting the default so if the user will not se it then it will set as the default

&#x20;       default: "This is the default about of the user!"

&#x20;   },

&#x20;   skills: {

&#x20;       //Empty space will be created by default for the array

&#x20;       type: \[String],

&#x20;   }

},{

&#x20;   //Leting mongodb keepping the record of the when the user is signup or updated

&#x20;   // for evry user by default 

&#x20;   //created at and updated at will autometically be added and updated will be

&#x20;   //  change for the every next update/

&#x20;   timestamps:true,

&#x20;   //always use it two sort the users when they or the users came in the last 7 days

});



```

Now for some of the fields which should do not allowed to be updated we have to add more validation in our patch api which only allows certain fields to update.

then I removed the userId from allow update list and set the const userid to take user id by the parameters instead of the body

API level validation:-

```javascript

//patch Api - TO Update the data of the user by id
app.patch("/user/:userId", async (req,res) => {
    const data = req.body;
    //taking the userId from the body
    const userId = req.params?.userId;
    console.log(userId);


    try{
        //array list of fields allowed for update
        const ALLOWED_UPDATES = [
        "skills",
        "about",
        "photoUrl",
        "age",
        "gender"
    ];

    //ittraing throw every key passed to update and checking if 
    //the allowed update list includes it
    const isUpdateAllowed = Object.keys(data).every((k) =>  
        ALLOWED_UPDATES.includes(k));

    //if the field is not in the allowed update list then throw an error
    if(!isUpdateAllowed){
        throw new Error("Update not allowed");
    }
        //Matching the userId in the DB by checking every _id
        //And there are lot more options to use after the update 
        const user = await User.findByIdAndUpdate(userId, data, {
            returnDocument: 'after',
            //it will the validators on the updates.
            runValidators: true,
        });

        res.send("User updated successfully");
    }
    catch(err){
        res.status(400).send("Update Failed: "+ err.message);
    }
});
```

To validate the stuffs like email we have to do a lot of work but no worries because validator library makes our work easier by doing that for use so,
just do: npm instal validator
and use like that: validator.isemail(); it says true if the formate is correct.

This is the code with all the validation by validator lib and by ai also:-

 Code:-

```javascript


const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
    firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    minlength: [2, 'First name must be at least 2 characters'],
    maxlength: [50, 'First name cannot exceed 50 characters'],
  },
   lastName:{
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    minlength: [2, 'Last name must be at least 2 characters'],
    maxlength: [50, 'Last name cannot exceed 50 characters'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    //validating the email formate
    validate(value){
        if(!(validator.isEmail(value))){
            throw new Error("Invalid email address: "+value);
        }
    },
  },

    password: {
    type: String,
    required: [true, 'Password is required'],
    select: false, // Don't return password in queries by default
    //validating the passwords strength
    validate(value) {
        if(!validator.isStrongPassword(value)) {
            throw new Error("Password must be at least 8 characters with at least one uppercase, one lowercase, one number, and one special character (@$!%*?&)");
        }
      },
  },
    age: {
        type: Number,
        min: 18,
    },
    Gender: {
        type: String,
        lowercase: true,
        //validating the gender
        validate(value) {
            if(!["male","female","other"].includes(value)){
                throw new Error("Gender data is not validated");
            }
        },
    },
    photoUrl: {
        type: String,
        //default photo url
        default:"https://img.magnific.com/premium-vector/default-avatar-profile-icon-gray-placeholder-vector-illustration_514344-14759.jpg?semt=ais_hybrid&w=740&q=80",
        //validating the  photo url
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Invalid photo URL: "+value);
            }
        }

    },
    about: {
        type: String,
        default: "This is the default about of the user!"
    },
    skills: {
        type: [
            {
                type:String,
                minLength:[3],
                maxLength:[20]
            }
        ],
        //validating the number elements in skills
        validate(value) {
            if(value.length>5){
                throw new Error("You can only put a maximum of 5 skills")
            }
        }
    }
},
{
    timestamps:true,
}
);

const User = mongoose.model("User",userSchema);

module.exports = User;



```
