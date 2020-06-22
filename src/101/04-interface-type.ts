/*
  I can't print out types because they aren't values
*/
type StringNumberTuple = [string, number];
type BinaryArrayOfStrings = "0" | "1";

/*
  Spread syntax for numbers only
*/
function sum(...numbers: number[]): number {
  return numbers.reduce(
    (accumulator: number, number: number): number => accumulator + number,
    0,
  );
}

function subtract(...numbers: number[]): number {
  return numbers.reduce(
    (accumulator: number, number: number): number => accumulator - number,
    0,
  );
}

/*
  Spread syntax for string only
*/
function maxlen(...strings: string[]): number {
  return strings.reduce(
    (accumulator: number, string: string): number =>
      Math.max(accumulator, string.length),
    0,
  );
}

function minlen(...strings: string[]): number {
  return strings.reduce(
    (accumulator: number, string: string): number =>
      accumulator === 0 ? string.length : Math.min(accumulator, string.length),
    0,
  );
}

/*
  Spread syntax for tuples with 2 indexes where the first must be a string and the second one must be a number
  It will return null if the list of arguments, identifier by the variable tuples, is empty
*/
function older<T extends StringNumberTuple>(...tuples: T[]): T | null {
  return tuples.reduce((accumulator: T | null, tuple: T): T | null => {
    if (accumulator === null) {
      return tuple;
    }

    return accumulator[1] > tuple[1] ? accumulator : tuple;
  }, null);
}

function younger<T extends StringNumberTuple>(...tuples: T[]): T | null {
  return tuples.reduce((accumulator: T | null, tuple: T): T | null => {
    if (accumulator === null) {
      return tuple;
    }

    return accumulator[1] > tuple[1] ? tuple : accumulator;
  }, null);
}

/*
  A generic function whose arguments must be either '1' or '0'
  It will return the decimal value of the given binary
  The binary arguments are interpreted as big-endian

      binary('1', '0', '0') => 4
*/
function binary<B extends BinaryArrayOfStrings>(...bits: B[]): number {
  // Number.isNaN(parseInt()) // true
  return parseInt(
    bits.length < 1 ? "0" : bits.join(""),
    2,
  );
}

const boyTuple: StringNumberTuple = ["john", 10];
const girlTuple: StringNumberTuple = ["mary", 11];

console.log('const boyTuple: [string, number] = ["john", 10]');
console.log(boyTuple);
console.log("");

console.log('const girlTuple: [string, number] = ["mary", 11]');
console.log(girlTuple);
console.log("");

console.log("sum()");
console.log(sum());
console.log("");

console.log("sum(1, 2, 3, 4)");
console.log(sum(1, 2, 3, 4));
console.log("");

console.log("subtract(5, 6, 7, 8)");
console.log(subtract(5, 6, 7, 8));
console.log("");

console.log('maxlen("deno", "dptole")');
console.log(maxlen("deno", "dptole"));
console.log("");

console.log('minlen("dptole", "deno")');
console.log(minlen("dptole", "deno"));
console.log("");

console.log("maxlen()");
console.log(maxlen());
console.log("");

console.log("minlen()");
console.log(minlen());
console.log("");

console.log("older<StringNumberTuple>(boyTuple, girlTuple)");
console.log(older<StringNumberTuple>(boyTuple, girlTuple));
console.log("");

console.log("younger(boyTuple, girlTuple)");
console.log(younger(boyTuple, girlTuple));
console.log("");

console.log("younger()");
console.log(younger());
console.log("");

console.log('binary("1", "0" "0")');
console.log(binary("1", "0", "0"));
console.log("");

console.log("binary()");
console.log(binary());
console.log("");

/*
  Nonsense. The variable s is ['1', '0', '1'] but BinaryArrayOfStrings can't detect that
  all the items of the s array, after returned by split(''), are valid

      error: TS2322 [ERROR]: Type 'string[]' is not assignable to type 'BinaryArrayOfStrings[]'.
        Type 'string' is not assignable to type 'BinaryArrayOfStrings'.
      const s:BinaryArrayOfStrings[] = '101'.split('')
            ^
*/
const a: BinaryArrayOfStrings[] = ["1", "0", "1"];
console.log('const a:BinaryArrayOfStrings[] = ["1","0", "1"]');
console.log("binary(...a)");
console.log(binary(...a));
