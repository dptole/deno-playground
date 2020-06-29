/*
  deno run --unstable src/std/01-io.ts
*/
declare module Deno {
  function setRaw(rid: number, mode: boolean): void;
}

async function readUserInputHidden(question: string): Promise<string> {
  /*
    https://github.com/caspervonb/deno-prompts
  */
  if (typeof Deno.setRaw !== "function") {
    return await readUserInput(question);
  }

  let input = "";
  let currentLine = question + " ";
  let stars = "";
  let uint8array: Uint8Array = new Uint8Array(0);

  Deno.stdout.write(new TextEncoder().encode(currentLine));
  Deno.setRaw(0, true);

  while (1) {
    let removeStar = false;
    let addStar = false;
    uint8array = new Uint8Array(4);
    const length = await Deno.stdin.read(uint8array);

    if (!length) {
      Deno.setRaw(Deno.stdin.rid, false);
      break;
    }

    if (length !== 1) {
      continue;
    }

    const newInput = new TextDecoder().decode(uint8array.slice(0, length));

    if (["\x03", "\x04", "\x08", "\r", "\n"].includes(newInput)) {
      if (newInput !== "\x08") {
        Deno.setRaw(Deno.stdin.rid, false);
      }
      break;
    }

    if ("\x7f" === newInput) {
      removeStar = input.length > 0;
    } else {
      addStar = true;
    }

    if (removeStar) {
      Deno.stdout.write(
        new TextEncoder().encode(
          "\r" + " ".repeat(currentLine.length + stars.length),
        ),
      );
      stars = stars.slice(0, -1);
      input = input.slice(0, -1);
    }

    if (addStar) {
      stars += "*";
      input += newInput;
    }

    Deno.stdout.write(new TextEncoder().encode("\r" + currentLine + stars));
  }

  console.log("");

  return input;
}

async function readUserInput(question: string): Promise<string> {
  Deno.stdout.write(new TextEncoder().encode(question + " "));
  const uint8array: Uint8Array = new Uint8Array(1000);
  const length = await Deno.stdin.read(uint8array) as number;
  return new TextDecoder().decode(uint8array.slice(0, length - 1));
}

readUserInput("Email:").then((email) =>
  readUserInputHidden("Password:").then((password) => {
    console.log(`Your email is "${email}" (LENGTH=${email.length})`);
    console.log(`Your password is "${password}" (LENGTH=${password.length})`);
  })
).catch((error) => console.log("Error", error)).then(() => Deno.exit());
