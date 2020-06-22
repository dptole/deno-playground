/*
  Generic functions...
*/
function makeArrayOfThing<T>(thing: T): T[] {
  return [thing];
}

console.log("makeArrayOfThing(1)");
const numbers = makeArrayOfThing(1);
console.log(numbers, "\n");

console.log("makeArrayOfThing('name')");
const strings = makeArrayOfThing("name");
console.log(strings, "\n");

console.log("makeArrayOfThing({})");
const emptyObjects = makeArrayOfThing({});
console.log(emptyObjects, "\n");

console.log("makeArrayOfThing({key: 'value'})");
const populatedObjects = makeArrayOfThing({ key: "value" });
console.log(populatedObjects, "\n");

console.log("makeArrayOfThing([])");
const emptyArrays = makeArrayOfThing([]);
console.log(emptyArrays, "\n");

console.log("makeArrayOfThing(['d', 'p', 't', 'o', 'l', 'e'])");
const arrayOfStrings = makeArrayOfThing("dptole".split(""));
console.log(arrayOfStrings, "\n");

console.log("makeArrayOfThing([4, 2, 0, 6, 9])");
const arrayOfNumbers = makeArrayOfThing([4, 2, 0, 6, 9]);
console.log(arrayOfNumbers, "\n");

console.log("makeArrayOfThing(new Date())");
const dates = makeArrayOfThing(new Date());
console.log(dates, "\n");

console.log("makeArrayOfThing(Symbol('ok'))");
const symbols = makeArrayOfThing(Symbol("ok"));
console.log(symbols, "\n");

console.log("makeArrayOfThing(null)");
const nulls = makeArrayOfThing(null); // https://en.wikipedia.org/wiki/Tony_Hoare
console.log(nulls, "\n");

/*
  Breaking rules to build knowledge

  numbers.push('1')
  error: TS2345 [ERROR]: Argument of type '"1"' is not assignable to parameter of type 'number'.

  strings.push(1)
  error: TS2345 [ERROR]: Argument of type '1' is not assignable to parameter of type 'string'.

*/

emptyObjects.push(new RegExp(""));
emptyObjects.push(new Date());
emptyObjects.push([1, 2, 3]);

console.log("emptyObjects");
console.log(emptyObjects, "\n");

console.log("emptyObjects[0].constructor");
console.log(emptyObjects[0].constructor, "\n");

console.log("emptyObjects[1].constructor");
console.log(emptyObjects[1].constructor, "\n");

console.log("emptyObjects[2].constructor");
console.log(emptyObjects[2].constructor, "\n");

console.log("emptyObjects[3].constructor");
console.log(emptyObjects[3].constructor, "\n");
