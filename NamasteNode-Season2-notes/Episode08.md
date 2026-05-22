Episode08



### Data Sanitization \& Schema Validations



DataBase validation and input sensitisation is needed to make our API and app secure and unvenerable.



In our app the api which saves the data into the database should be checked and validated first there are two api signup and patch which takes the data and saves it



Code:- Schema validation



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

