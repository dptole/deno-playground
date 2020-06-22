/*
  By preceding the arguments of a constructor with public they are
  automatically bound to the instance.

  The line "this.fullName" would trigger an error without "fullName: string"
  declaring that it exists.

  error: TS2339 [ERROR]: Property 'fullName' does not exist on type 'Student'.
  this.fullName = firstName + ' ' + middleInitial + ' ' + lastName

*/
class Student {
  fullName: string;
  anotherFullName: String =
    'string seems to be just like an interface. String can also be used as a type... Here I am initilizing the attribute. Without it an error would occur: error: TS2564 [ERROR]: Property "anotherFullName" has no initializer and is not definitely assigned in the constructor.';

  constructor(
    public firstName: string,
    public middleInitial: string,
    public lastName: string,
  ) {
    this.fullName = firstName + " " + middleInitial + " " + lastName;
  }
}

/*
  Interfaces seem to be just type hints similar to PropTypes but can't be used
  as values.

  console.log(Person)

  error: TS2693 [ERROR]: 'Person' only refers to a type, but is being used as a value here.
*/
interface Person {
  firstName: string;
  lastName: string;
}

/*
  Interfaces can be used as parameter types.
*/
function greetPerson(person: Person) {
  return "Hello person " + person.firstName + " " + person.lastName;
}

/*
  Classes can also be used as parameter types.
*/
function greetStudent(student: Student) {
  return "Hello student " + student.firstName + " " + student.lastName;
}

/*
  New instance same as in JS.
*/
const student = new Student("Class", "Middle", "Instance");

const object = {
  firstName: "Simple",
  lastName: "Object",
};

console.log(student, "\n");

console.log("Greet person using student");
console.log("   ", greetPerson(student), "\n");

console.log("Greet student using student");
console.log("   ", greetStudent(student), "\n");

console.log("Object");
console.log("   ", object, "\n");

console.log("Greet person using object");
console.log("   ", greetPerson(object), "\n");

/*
I can't call this function using object.

console.log('Greet student using object')
console.log('   ', greetStudent(object), '\n')

error: TS2345 [ERROR]: Argument of type '{ firstName: string; lastName: string; }' is not assignable to parameter of type 'Student'.
Type '{ firstName: string; lastName: string; }' is missing the following properties from type 'Student': fullName, middleInitial

*/

console.log("Log greetPerson");
console.log(greetPerson + "\n");

console.log("Log greetStudent");
console.log(greetStudent + "\n");

console.log("Log Student class");
console.log(Student + "\n");
