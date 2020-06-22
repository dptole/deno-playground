

function fromNumbersToStrings(numbers: number[]): string[] {
    return numbers.map((number: number): string =>
        number.toString()
    )
}


function commaSeparated<T = string | number>(tokens: T[], oxford: boolean = false): string {
    if (tokens.length < 2) {
        return tokens.join('')
    }

    return tokens.slice(0, -1).join(', ') +
        (oxford ? ',' : '') + 
        ' and ' +
        tokens.slice(-1)
}


function * fib(startAtIndex: number = 0): Generator<number> {
    /*
      If I omit the * (asterisk) between 'function' and 'the name of the function' or '('
      it correctly tells me about it

        error: TS1163 [ERROR]: A 'yield' expression is only allowed in a generator body.
                yield a;
                ~~~~~
    */
    let totalFibsGenerated: number = 0
    let totalFibsSkipped: number = 0
    let a: number = 1
    let b: number = 1

    if (!Number.isFinite(startAtIndex) || startAtIndex < 1) {
        startAtIndex = 0
    }

    console.log('Generating fibs starting from index', startAtIndex)

    while (1) {
        if (startAtIndex-- < 1) {
            console.log('*fib(): Total fibs generated', ++totalFibsGenerated, '=', a)

            /*
              A bunch of errors if I forget a semi-colon after "yield a" AND there it's followed by a destructuring assignment

                error: TS7053 [ERROR]: Element implicitly has an 'any' type because expression of type 'number' can't be used to index type 'Number'.
                  No index signature with a parameter of type 'number' was found on type 'Number'.
                        yield a

                TS2322 [ERROR]: Type 'number[]' is not assignable to type 'number'.
                        yield a

                TS2695 [ERROR]: Left side of comma operator is unused and has no side effects.
                        [a, b] = [b, a + b]
                         ^
            */
            yield a
        } else {
            console.log('*fib(): Total fibs skipped', ++totalFibsSkipped, '=', a)
        }

        [a, b] = [b, a + b]
    }
}


const fibs: number[] = []


const fibsGenerator: Generator<number> = fib(5)


console.log('Generate fibs before for..of statement')
console.log(fibsGenerator.next())
console.log(fibsGenerator.next())
console.log(fibsGenerator.next())
console.log(fibsGenerator.next())
console.log('')


for (const nextFib of fibsGenerator) {
    if (fibs.length > 10) {
      break
    }

    fibs.push(nextFib)
}


console.log('')


console.log('All fibs generated <number>', fibs.length)
console.log(commaSeparated<number>(fibs))
console.log('')


console.log('All fibs generated <string>', fibs.length)
console.log(commaSeparated<string>(fromNumbersToStrings(fibs), true))
console.log('')


console.log('Generate fibs after for..of statement')
console.log(fibsGenerator.next())
console.log(fibsGenerator.next())
console.log('')
