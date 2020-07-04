/*
  deno run --allow-read src/io/03-io.ts

  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array
*/
type Nullable<T> = T | null;

interface NewLine {
  linux: number;
  mac: number;
  win: number;
}

function countNewLines(uint8: Uint8Array): NewLine {
  let newLines: NewLine = {
    linux: 0,
    mac: 0,
    win: 0,
  };
  let currentIndex: number = 0;
  let uint8SliceLength: number = 2;

  while (uint8.slice(currentIndex).length > uint8SliceLength) {
    const lineFeedIndex: number = uint8.indexOf(10, currentIndex); // 10 is \n
    const carriageReturnIndex: number = uint8.indexOf(13, currentIndex); // 13 is \r

    if (~lineFeedIndex) {
      newLines.linux++;
    }

    if (~carriageReturnIndex) {
      newLines.mac++;
    }

    if (~carriageReturnIndex && carriageReturnIndex + 1 === lineFeedIndex) {
      newLines.win++;
    }

    currentIndex = Math.max(lineFeedIndex, carriageReturnIndex);

    if (!~currentIndex) {
      /*
        No new line found.
      */
      break;
    }

    currentIndex++;
  }

  return newLines;
}

function getLineCountConclusion(lines: number): string {
  return lines + (
    lines === 1 ? " (This file is just one long line!)" : ""
  );
}

const thisFile: string = new URL(import.meta.url).pathname;
const uint8Size: number = 2 ** 11;

Deno.open(thisFile).then(
  async (file: Deno.File): Promise<Nullable<NewLine>> => {
    console.log("Counting the existing lines in", thisFile);

    function updateLines(): void {
      const [lastUint8, currentUint8] = uint8s;

      if (lastUint8 === null || currentUint8 === null) {
        return;
      }

      const lastAndCurrentUint8 = new Uint8Array(lastUint8.length + 1);
      lastAndCurrentUint8.set(lastUint8);
      lastAndCurrentUint8.set(currentUint8.slice(0, 1), lastUint8.length);

      const newLines = countNewLines(lastAndCurrentUint8);

      if (lines === null) {
        lines = newLines;
      } else {
        lines.linux += newLines.linux;
        lines.mac += newLines.mac;
        lines.win += newLines.win;
      }
    }

    let lines: Nullable<NewLine> = {
      linux: 1,
      mac: 1,
      win: 1,
    };
    const uint8s: [Nullable<Uint8Array>, Nullable<Uint8Array>] = [null, null];

    while (1) {
      console.log("");
      console.log("  Reading a chunk of", uint8Size, "bytes");
      const uint8 = new Uint8Array(uint8Size);
      const uint8Length = await file.read(uint8);

      if (uint8Length == null) {
        console.log("  No more chunks to read from");
        uint8s[1] = new Uint8Array();
        console.log(
          "  Setting the second chunk as an empty Uint8Array for consistency",
        );
        updateLines();
        break;
      }

      console.log(
        "  When trying to read",
        uint8Size,
        "bytes I could only read",
        uint8Length,
        "bytes",
      );
      uint8s[uint8s[0] ? 1 : 0] = uint8.slice(0, uint8Length);

      if (uint8s[0] && uint8s[1]) {
        console.log("  Two chunks ready, let's count the lines");
        updateLines();
        console.log("  Remove the older chunk");
        uint8s[0] = uint8s[1];
        uint8s[1] = null;
      } else {
        console.log("  There is only one chunk, let's wait for the next one");
      }
    }

    console.log("");
    console.log("Done!");
    console.log(
      "  Different OSes interpret the new line character differently, therefore:",
    );
    console.log("  Linux lines:", getLineCountConclusion(lines.linux));
    console.log("  Mac lines:", getLineCountConclusion(lines.mac));
    console.log("  Windows lines:", getLineCountConclusion(lines.win));

    return lines;
  },
).catch((e) => {
  console.log(e);
});
