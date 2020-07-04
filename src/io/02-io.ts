/*
  deno run --allow-read src/io/02-io.ts
*/
declare module Deno {
  module core {
    function decode(input: Uint8Array): string;
  }

  interface Blob {
    readonly size: number;
    readonly type: string;
    arrayBuffer(): Promise<ArrayBuffer>;
    slice(start?: number, end?: number, contentType?: string): Blob;
    stream(): ReadableStream;
    text(): Promise<string>;
  }

  interface OpenOptions {
    read?: boolean;
    write?: boolean;
    append?: boolean;
    truncate?: boolean;
    create?: boolean;
    createNew?: boolean;
    mode?: number;
  }

  interface File extends Blob {
    readonly lastModified: number;
    readonly name: string;
    read(p: Uint8Array): Promise<number | null>;
    readSync(p: Uint8Array): number | null;
    seek(offset: number, whence: SeekMode): Promise<number>;
    seekSync(offset: number, whence: SeekMode): number;
  }

  interface Reader {
    read(p: Uint8Array): Promise<number | null>;
  }

  enum SeekMode {
    Start = 0,
    Current = 1,
    End = 2,
  }

  function open(path: string, options?: Deno.OpenOptions): Promise<Deno.File>;
  function iter(
    r: Deno.Reader,
    options?: object,
  ): AsyncIterableIterator<Uint8Array>;
}

const thisFile: string = new URL(import.meta.url).pathname;
const bufferLength: number = 2 ** 11;

Deno.open(thisFile).then(async (file: Deno.File): Promise<Deno.File> => {
  let allContent: string = "";
  let batchNumber: number = 1;

  console.log("Read content via file.read(buffer)");

  while (1) {
    console.log("  Batch", batchNumber);
    console.log("  Reading a batch of", bufferLength, "bytes");

    const buffer = new Uint8Array(bufferLength);
    const readLength = await file.read(buffer);

    if (readLength == null) {
      /*
        True for undefined too.
      */
      break;
    }

    allContent += Deno.core.decode(buffer.slice(0, readLength));

    console.log(
      "  In trying to read",
      bufferLength,
      "bytes I could read",
      readLength,
      "bytes",
    );
    console.log(
      "  The total amount of bytes read at the moment is",
      allContent.length,
      "bytes",
    );
    console.log("");

    if (bufferLength > readLength) {
      break;
    }

    batchNumber++;
  }

  console.log(
    "  The total amount of bytes present in the file",
    thisFile,
    "is",
    allContent.length,
    "bytes",
  );
  console.log("");

  return file;
}).then(async (file: Deno.File): Promise<Deno.File> => {
  const cursorPosition: number = 0;
  console.log("Returning the pointer to the position", cursorPosition);
  await file.seek(cursorPosition, Deno.SeekMode.Start);
  console.log("");

  return file;
}).then(async (file: Deno.File): Promise<Deno.File> => {
  console.log("Read content via for await..of statement");

  const iterOptions = {
    bufSize: bufferLength,
  };
  let batchNumber: number = 1;
  let allContent: string = "";

  for await (const chunk of Deno.iter(file, iterOptions)) {
    console.log("  Batch", batchNumber);
    allContent += Deno.core.decode(chunk);
    console.log(
      "  In trying to read",
      bufferLength,
      "bytes I could read",
      chunk.length,
      "bytes",
    );
    console.log(
      "  The total amount of bytes read at the moment is",
      allContent.length,
      "bytes",
    );
    batchNumber++;
    console.log("");
  }

  console.log(
    "  The total amount of bytes present in the file",
    thisFile,
    "is",
    allContent.length,
    "bytes",
  );
  console.log("");

  return file;
}).then(async (file: Deno.File): Promise<Deno.File> => {
  const cursorPosition: number = 0;
  console.log("Returning the pointer to the position", cursorPosition, "again");
  await file.seek(cursorPosition, Deno.SeekMode.Start);
  console.log("");

  return file;
}).then((file: Deno.File): Deno.File => {
  console.log("Read content via file.readSync(buffer)");

  console.log("  Get file length");
  const cursorPosition = file.seekSync(0, Deno.SeekMode.End);
  const allContent = new Uint8Array(cursorPosition);
  console.log("  File length is", cursorPosition);
  console.log("");

  console.log("  Restart file cursor");
  file.seekSync(0, Deno.SeekMode.Start);
  console.log("");

  console.log("  Read file content synchronously");
  const newCursorPosition = file.readSync(allContent);
  console.log("  Current cursor position is", newCursorPosition);
  console.log(
    "  The total amount of bytes present in the file",
    thisFile,
    "is",
    allContent.length,
    "bytes",
  );
  console.log("");

  return file;
}).catch((e: any) => {
  console.log(e);
});
