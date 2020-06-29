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

  Deno.stdout.write(new TextEncoder().encode(question + " "));
  Deno.setRaw(0, true);

  while (1) {
    const uint8array: Uint8Array = new Uint8Array(1);
    const length = await Deno.stdin.read(uint8array);

    if (!length) {
      break;
    }

    const newInput = new TextDecoder().decode(uint8array.slice(0, length));
    input += newInput;

    if (["\x03", "\x04", "\x08", "\r", "\n"].includes(newInput)) {
      input = input.slice(0, -1);
      Deno.setRaw(Deno.stdin.rid, false);
      break;
    }

    Deno.stdout.write(new TextEncoder().encode("*"));
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
    console.log("Your email is", email);
    console.log("Your password is", password);
  })
);
