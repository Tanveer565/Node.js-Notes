console.log("SpiderMan");
function calculateSum(a,b){
    const sum = a + b;
    console.log(sum);
}

const x = true;


// exporting the var and method to other module using comman js
module.exports = {
    x,
    calculateSum:calculateSum,
}

// this is how you can export using es6 module
// export function calculateSum(a,b){
//     const sum = a + b;
//     console.log(sum);
// }

// export const x = true;
