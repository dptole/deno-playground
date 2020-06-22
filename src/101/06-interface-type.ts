enum Diff {
  GT,
  EQ,
  LT,
  NAN,
}

interface GuessNumberInterface {
  diff: Diff;
  attempts: number;
}

class GuessNumber implements GuessNumberInterface {
  constructor(public diff: Diff, public attempts: number) {
  }
}

// https://stackoverflow.com/a/61048983
async function prompt(question: string = "") {
  const buf = new Uint8Array(1024);
  await Deno.stdout.write(new TextEncoder().encode(question));
  const n: number = <number> await Deno.stdin.read(buf);
  const answer = new TextDecoder().decode(buf.subarray(0, n));
  return answer.trim();
}

/*
  Asynchronously generates numbers yielding instances of GuessNumber
*/
async function* createNumberGuessingGame(
  max: number,
): AsyncGenerator<GuessNumber> {
  const numberGenerated: number = Math.random() * max >> 0;
  let totalAttempts: number = 0;
  let diff: Diff = Diff.NAN;

  console.log(
    "A random number between 0 and " + max + " (inclusive) was generated",
  );

  while (1) {
    const answerNumber: number = parseInt(await prompt("Guess "));

    if (Number.isNaN(answerNumber)) {
      diff = Diff.NAN;
    } else {
      diff = answerNumber === numberGenerated
        ? Diff.EQ
        : answerNumber > numberGenerated
        ? Diff.GT
        : Diff.LT;

      totalAttempts++;
    }

    yield new GuessNumber(diff, totalAttempts);

    if (diff === Diff.EQ) {
      break;
    }
  }
}

for await (
  const guess of createNumberGuessingGame(1_000 /* Ruby/Elixir syntax */)
) {
  if (guess.diff === Diff.EQ) {
    console.log("You guessed it!", "Attempts:", guess.attempts);

    if (guess.attempts > 1) {
      console.log("Try to lower your attempts count next time");
    } else {
      console.log("Can't get any better than this");
    }
  } else if (guess.diff === Diff.LT) {
    console.log("Too low, try again");
  } else if (guess.diff === Diff.GT) {
    console.log("Too high, try again");
  } else {
    console.log("Not a valid number, try again");
  }
}
