const math = require('mathjs');

//Helper Functions
//This map helps us determine how to convert based on the unit of the input
const unitMap = new Map([
  ['lbs', ['kg',0.453592, 'pounds', 'kilograms']],
  ['gal', ['L', 3.78541, 'gallons', 'liters']],
  ['mi', ['km', 1.60934, 'miles', 'kilometers']],
]);

//Use ASCII code of the character to determine if char is a letter
const isLetter = (char) => {
  const n = char.charCodeAt(0);
  return (n >= 65 && n < 91) || (n >= 97 && n < 123);
}

//Math.js does not handle invalid expressions.
//A try-catch expression is used instead, if we get an error
const isValidExpression = (expr) => {
  try {
    const num = math.evaluate(expr);
    return num;
  }
  catch(ex) {
    return undefined;
  }
}

//Converter Function
module.exports = (req,res) => {
  const input = req.query.input;
  let unitIndex = -1;
  let number = "";
  let unit = "";

  //Find starting index of the unit of the input
  for(let i = input.length-1; i >= 0; i--) {
    if((i != 0 && isLetter(input.charAt(i)) && !isLetter(input.charAt(i-1))) ||
      (i == 0 && isLetter(input.charAt(i)))) {
      unitIndex = i;
      break;
    }
  }

  //If unitIndex is 0, meaning no number was given, we set the number to 1 
  number = unitIndex == 0 ? "1" : input.slice(0,unitIndex);
  unit = input.slice(unitIndex);
 
  //Check if the number and unit are valid
  const convertedNumber = isValidExpression(number);
  const convertedUnit = unitMap.has(unit) ? unitMap.get(unit)[0] : undefined;

  if(convertedNumber === undefined && convertedUnit === undefined) {
    res.json({"error": "invalid number and unit"})
  }
  if(convertedNumber === undefined) {
    res.json({"error": "invalid number"});
  }
  if(convertedUnit === undefined) {
    res.json({"error": "invalid unit"});
  }

  const convertString = convertedNumber + " "  //Original number
                    + unitMap.get(unit)[2]  //Original unit
                    + ' converts to ' 
                    + convertedNumber*unitMap.get(unit)[1] + " " //Converted Number
                    + unitMap.get(unit)[3]; //Converted Unit

  res.json({
    "initNum" : convertedNumber,
    "initUnit" : unit,
    "returnNum" : convertedNumber*unitMap.get(unit)[1],
    "returnUnit": unitMap.get(unit)[0],
    "string" : convertString
  })

}