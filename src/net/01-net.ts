/*
  deno run --allow-net src/net/01-net.ts
*/
declare module Deno {
  module core {
    function decode(input: Uint8Array): string;
    function encode(input: string): Uint8Array;
  }
}

const port = 3333;
const hostname = "0.0.0.0";
const readChunkLength: number = 2 ** 15;
console.log("Listening to TCP port " + hostname + ":" + port);

const listener = Deno.listen({
  hostname,
  port,
});

for await (const conn of listener) {
  console.log("New connection!");
  console.log("");

  let requestData = "";
  while (1) {
    const uint8: Uint8Array = new Uint8Array(readChunkLength);
    const uint8Length = await conn.read(uint8);

    if (!uint8Length) {
      break;
    }

    requestData += Deno.core.decode(uint8.slice(0, uint8Length));

    break;
  }

  console.log("Request payload");
  console.log(requestData.trim());
  console.log("");

  const body = [
    "Hello Deno!",
    "",
    "Your request header is",
    "---",
    requestData,
    "---",
    "I can only read " + readChunkLength + " bytes per request",
    "",
  ].join("\n");

  const headers = [
    "HTTP/1.0 200 OK",
    "content-type: text/plain",
    "content-length: " + body.length,
    "",
    "",
  ].join("\r\n");

  const connectionResponse = Deno.core.encode(headers + body);

  await conn.write(connectionResponse);
  console.log("Response sent");
  console.log("");

  console.log("Resources opened at the moment");
  console.log(Deno.resources());
  console.log("");

  console.log("System metrics at the moment");
  console.log(Deno.metrics());
  console.log("");

  console.log(conn);
  console.log("-----");
  conn.close();

  break;
}

console.log("Closing TCP connection to port " + hostname + ":" + port);
