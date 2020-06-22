/*
  When using interface methods the body of the declaration must only
  state the type that method should return.
*/
interface Speaker {
  speak: () => string;
  name: string;
  childOrUndefined?: Person;
  childOrNull: Person | null;

  /*
      Very weird error messages

          error: TS1070 [ERROR]: 'private' modifier cannot appear on a type member.
              private privateInterfaceMethod: () => number[]
              ~~~~~~~

    */
}

class Person implements Speaker {
  /*
      It detects when a class's interface is badly implemented
      For the missing name property

          error: TS2420 [ERROR]: Class 'Person' incorrectly implements interface 'Speaker'.
            Property 'name' is missing in type 'Person' but required in type 'Speaker'.
          class Person implements Speaker {
                ~~~~~~

              'name' is declared here.
                  name: string
                  ~~~~

    */
  name: string;
  childOrUndefined?: Person;
  childOrNull: Person | null;

  /*
      Actually actionable error message

          error: TS1016 [ERROR]: A required parameter cannot follow an optional parameter.
             constructor(name: string, childOrUndefined?: Person, childOrNull: Person | null) {
                                                                  ~~~~~~~~~~~
    */
  constructor(
    name: string,
    childOrNull: Person | null = null,
    childOrUndefined?: Person,
  ) {
    this.name = name;
    this.childOrUndefined = childOrUndefined;
    this.childOrNull = childOrNull;
  }

  /*
      For the missing speak() method

          error: TS2420 [ERROR]: Class 'Person' incorrectly implements interface 'Speaker'.
            Property 'speak' is missing in type 'Person' but required in type 'Speaker'.
          class Person implements Speaker {
                ~~~~~~

              'speak' is declared here.
                  speak: () => string
                  ~~~~~

      For the speak() method whose return differs from the interface

          error: TS2416 [ERROR]: Property 'speak' in type 'Person' is not assignable to the same property in base type 'Speaker'.
            Type '() => number' is not assignable to type '() => string'.
              Type 'number' is not assignable to type 'string'.
              speak():number {
              ~~~~~
    */
  speak(): string {
    console.log("  this.#newSyntaxForPrivateFields");
    console.log(" ", this.#newSyntaxForPrivateFields);

    console.log("  this.oldSyntaxForPrivateFields");
    console.log(" ", this.oldSyntaxForPrivateFields);

    return Math.random().toString(36).substr(2);
  }

  /*
      We can have static methods with the same name as the instance ones
    */
  static speak = (): number => {
    console.log("  Person.privateStaticName");
    console.log(" ", Person.oldStylePrivateStaticName);

    return Math.random();
  };

  /*
      Correct handling of private properties

          error: TS18013 [ERROR]: Property '#newSyntaxForFields' is not accessible outside class 'Person' because it has a private identifier.
          console.log(me.#newSyntaxForFields)

    */
  #newSyntaxForPrivateFields: string[] = "dptole".split("");

  private oldSyntaxForPrivateFields: string[] = "rubyno".split("");

  /*
      Interesting error when trying to create a static property that conflicts
      with something

          error: TS2699 [ERROR]: Static property 'name' conflicts with built-in property 'Function.name' of constructor function 'Person'.
              static name: string = 'Static person'

    */
  static staticName: string = "Static person";

  /*
      Interesting error when trying to access a private static property

          error: TS2341 [ERROR]: Property 'privateStaticName' is private and only accessible within class 'Person'.
          console.log(Person.privateStaticName)

      It seems that the new style of private static properties are not allowed

        error: TS18019 [ERROR]: 'static' modifier cannot be used with a private identifier
        static #newStylePrivateStaticName: string = 'Private static person'

    */
  private static oldStylePrivateStaticName: string = "Private static person";
}

function runNpcDialog<T extends Person>(people: T[]): T[] {
  /*
    You can inform the return type for anonymous functions too
  */
  people.forEach((person): void =>
    console.log("NPC " + person.name + " says " + person.speak())
  );

  return people;
}

console.log("const me = new Person('dptole')");
const me = new Person("dptole");
console.log(me);
console.log("");

console.log("runNpcDialog([me])");
runNpcDialog([me]);
console.log("");

/*
  Interestingly enough it seems like properties that start with # are considered to be private but are only allowed on class bodies

      error: TS18016 [ERROR]: Private identifiers are not allowed outside class bodies.
      const fromScratch = {name: 'dude', speak: function () { return 'ree' }, #newSyntaxForPrivateFields: ['d'], oldSyntaxForPrivateFields: 'txt' }

*/
console.log(
  "const fromScratch = {name: 'dude', speak: function () { return 'ree' }, #newSyntaxForPrivateFields: ['d'], oldSyntaxForPrivateFields: 'txt' }",
);
const fromScratch = {
  name: "dude",
  speak: function () {
    return "ree";
  },
  "#newSyntaxForPrivateFields": ["d"],
  oldSyntaxForPrivateFields: "txt",
};
console.log(fromScratch);
console.log("");

/*
  Seems like a wrongly categorized error message but I get it

      error: TS2741 [ERROR]: Property '#newSyntaxForPrivateFields' is missing in type '{ name: string; speak: () => string; '#newSyntaxForPrivateFields': string[]; oldSyntaxForPrivateFields: string; }' but required in type 'Person'.
      runNpcDialog([fromScratch])

console.log('runNpcDialog([fromScratch])')
runNpcDialog([fromScratch])
console.log('')
*/

console.log("Person.staticName");
console.log(Person.staticName);
console.log("");

console.log("Person.speak()");
console.log(Person.speak());
console.log("");
