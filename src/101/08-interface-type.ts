/*
  Mapped types & Conditional types & Generic conditional types
*/
type FunctionsAreTrue<T> = {
  [K in keyof T]: T[K] extends Function ? true : false;
};

type AllKeysOf<T> = {
  [K in keyof T]: K;
}[keyof T];

type AllFunctionKeysOf<T> = {
  [K in keyof T]: T[K] extends Function ? K : never;
}[keyof T];

type AllNonFunctionKeysOf<T> = {
  [K in keyof T]: T[K] extends Function ? never : K;
}[keyof T];

type AllStringKeysOf<T> = {
  [K in keyof T]: T[K] extends string ? K : never;
}[keyof T];

type AllNumericKeysOf<T> = {
  [K in keyof T]: T[K] extends number ? K : never;
}[keyof T];

/*
  Aliases of mapped types.
*/
type ListOfAllKeysOfSomeInterface = AllKeysOf<SomeInterface>[];
type ListOfAllFunctionKeysOfSomeInterface = AllFunctionKeysOf<SomeInterface>[];
type ListOfAllNonFunctionKeysOfSomeInterface = AllNonFunctionKeysOf<
  SomeInterface
>[];
type ListOfAllStringKeysOfSomeInterface = AllStringKeysOf<SomeInterface>[];
type ListOfAllNumericKeysOfSomeInterface = AllNumericKeysOf<SomeInterface>[];

/*
  Generic aliases of mapped types.
*/
type ListOfAllKeysOf<T> = AllKeysOf<T>[];
type ListOfAllFunctionKeysOf<T> = AllFunctionKeysOf<T>[];
type ListOfAllNonFunctionKeysOf<T> = AllNonFunctionKeysOf<T>[];
type ListOfAllStringKeysOf<T> = AllStringKeysOf<T>[];
type ListOfAllNumericKeysOf<T> = AllNumericKeysOf<T>[];

interface SomeInterface {
  name: string;
  year: number;
  getName(): string;
  getYear(): number;
}

class Language implements SomeInterface {
  name: string;
  year: number;
  description: string;

  constructor(name: string, year: number, description: string) {
    this.name = name;
    this.year = year;
    this.description = description;
  }

  getName(): string {
    return this.name;
  }
  getYear(): number {
    return this.year;
  }

  /*
    TypeScript, oh TypeScript...

    Without any runtime type checks one can easily cause runtime errors
    even using tons of abstractions to try to create a safe type environment.

    If I try to implement a method with the following type signature:

        batchUpdate(
          keys: ListOfAllStringKeysOf<Language> | ListOfAllNumericKeysOf<Language>,
          values: string[] | number[]
        ): this

    An error is raised:

        error: TS2322 [ERROR]: Type 'string' is not assignable to type 'number'.
                this[keys[i]] = values[i]
                ~~~~~~~~~~~~~

    I'm not sure why... Great error message by the way

    Because of that I had to copy/paste the same method body in two methods
    with different type signatures. Not very polymorphic.
  */
  updateStrings(keys: ListOfAllStringKeysOf<Language>, values: string[]): this {
    if (keys.length !== values.length) {
      return this;
    }

    for (let i = 0; i < keys.length; i++) {
      if (typeof this[keys[i]] === typeof values[i]) {
        this[keys[i]] = values[i];
      }
    }

    return this;
  }

  updateNumbers(
    keys: ListOfAllNumericKeysOf<Language>,
    values: number[],
  ): this {
    if (keys.length !== values.length) {
      return this;
    }

    for (let i = 0; i < keys.length; i++) {
      if (typeof this[keys[i]] === typeof values[i]) {
        this[keys[i]] = values[i];
      }
    }

    return this;
  }

  /*
    Interesting error

        error: TS18022 [ERROR]: A method cannot be named with a private identifier.
          batchUpdate(keys: ListOfAllStringKeysOf<Language> | ListOfAllNumericKeysOf<Language>, values: string[] | number[]): this {
          ~~~~~~~~~~~
  */
}

function functionNamesAreTrueOnSomeInterface(
  object: FunctionsAreTrue<SomeInterface>,
): void {
  console.log("Function key names are true");
  console.log("  name", object.name);
  console.log("  year", object.year);
  console.log("  getName", object.getName);
  console.log("  getYear", object.getYear);
}

function onlyAcceptsKeysOfSomeInterface(
  array: ListOfAllKeysOf<SomeInterface>,
): void {
  console.log("Keys of SomeInterface are:");
  console.log("  " + array.join(", "));
}

function onlyAcceptsFunctionKeysOfSomeInterface(
  array: ListOfAllFunctionKeysOf<SomeInterface>,
): void {
  console.log("Function keys of SomeInterface are:");
  console.log("  " + array.join(", "));
}

function onlyAcceptsNonFunctionKeysOfSomeInterface(
  array: ListOfAllNonFunctionKeysOf<SomeInterface>,
): void {
  console.log("Non function keys of SomeInterface are:");
  console.log("  " + array.join(", "));
}

function onlyAcceptsStringKeysOfSomeInterface(
  array: ListOfAllStringKeysOf<SomeInterface>,
): void {
  console.log("String keys of SomeInterface are:");
  console.log("  " + array.join(", "));
}

function onlyAcceptsNumericKeysOfSomeInterface(
  array: ListOfAllNumericKeysOf<SomeInterface>,
): void {
  console.log("Numeric keys of SomeInterface are:");
  console.log("  " + array.join(", "));
}

/*
  Interesting error. All fields in functions_are_true_on_some_class
  are of the type boolean. Because of this the type checker fails telling us
  that boolean, the type of the value of a field, can't be assigned to true or
  false in type FunctionsAreTrue<SomeClass>.

  This is like typescript telling us that we can't use this type signature
  because boolean may vary between true and false. The function
  functionNamesAreTrueOnSomeInterface only accepts fields whose values will never
  vary.

  How to do that? Type inference.

  Instead of letting typescript try and infer the type of each field by its
  value we do the inferring for typescript.

  const a: true = true // Ok because true (the value) can be assigned to the
                       // inferred type true.

  const b: boolean = false // Ok because false (the value) can be assigned to
                           // the type boolean, which accepts two variants:
                           // true and false

  const c: false = true as false // Ok because true (the value) is being
                                 // inferred to have the type false, using the
                                 // "as TYPE" notation after a value, and
                                 // therefore can be assigned to the type false
                                 // itself, even though its value is not false,
                                 // but the type is false, and thats ok for
                                 // typescript...

  const d: true = false as true // Ok, same explanation as c

  const e: boolean = true as true // Ok, same explanation as c
  const f: boolean = false as false // Ok, same explanation as c

      error: TS2345 [ERROR]: Argument of type '{ getName: boolean; name: boolean; getYear: boolean; year: boolean; }' is not assignable to parameter of type 'FunctionsAreTrue<SomeClass>'.
        Types of property 'name' are incompatible.
          Type 'boolean' is not assignable to type 'false'.
      functionNamesAreTrueOnSomeInterface(functions_are_true_on_some_class)
                                      ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

      const functions_are_true_on_some_class = {
        getName: true,
        name: false,
        getYear: true,
        year: false,
      }
      functionNamesAreTrueOnSomeInterface(functions_are_true_on_some_class)

*/

const functions_are_true_on_some_class = {
  getName: true as true,
  name: false as false,
  getYear: true as true,
  year: false as false,
};

const tsLang = new Language("TypeScript", 0, "JavaScript with types");

console.log("functions_are_true_on_some_class");
console.log(functions_are_true_on_some_class);
console.log("");

console.log(
  "functionNamesAreTrueOnSomeInterface(functions_are_true_on_some_class)",
);
functionNamesAreTrueOnSomeInterface(functions_are_true_on_some_class);
console.log("");

console.log("onlyAcceptsKeysOfSomeInterface(['getName', 'name'])");
onlyAcceptsKeysOfSomeInterface(["getName", "name"]);
console.log("");

console.log("onlyAcceptsFunctionKeysOfSomeInterface(['getName', 'getYear'])");
onlyAcceptsFunctionKeysOfSomeInterface(["getName", "getYear"]);
console.log("");

console.log("onlyAcceptsNonFunctionKeysOfSomeInterface(['name', 'year'])");
onlyAcceptsNonFunctionKeysOfSomeInterface(["name", "year"]);
console.log("");

console.log("onlyAcceptsNumericKeysOfSomeInterface(['year'])");
onlyAcceptsNumericKeysOfSomeInterface(["year"]);
console.log("");

console.log("ts.updateStrings(['name'], []).updateNumbers(['year'], [2020])");
tsLang.updateStrings(["name"], []).updateNumbers(["year"], [2020]);
console.log(tsLang);
console.log("");

console.log(
  "ts.updateStrings(['name', 'description'], ['TypeScript2', '...'])",
);
tsLang.updateStrings(["name", "description"], ["TypeScript2", "..."]);
console.log(tsLang);
console.log("");
