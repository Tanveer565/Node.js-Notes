//In this module i am just gonna import all the needed module and their var and methods

//so in the app.js file, you simply need to require calculateSum from the 
// calculate folder. Hereʼs how you can do it: require("./calculate") no need to mention index.js

//imporiting 
const {calculateSum , x} = require("./sum");

const{calculateMultiple} = require("./multiply");

//exporting

module.exports = {calculateMultiple , calculateSum , x};

