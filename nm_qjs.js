#!/usr/bin/env -S /path/to/qjs -m --std
// QuickJS Native Messaging host
// guest271314, 5-6-2022
import * as std from 'std';
import * as os from 'os';

function getMessage() {
  const header = new Uint32Array(1);
  std.in.read(header.buffer, 0, header.byteLength);
  const length = header[0];
  const output = new Uint8Array(length);
  std.in.read(output.buffer, 0, length);
  return output;
}

function encodeMessage(message) {
  // https://stackoverflow.com/a/24777120
  const header = Uint32Array.from(
    {
      length: 4,
    },
    (_, index) => (message.length >> (index * 8)) & 0xff
  );
  const output = new Uint8Array(header.length + message.length);
  output.set(header, 0);
  output.set(message, 4);
  return output;
}

function sendMessage(message) {
  std.out.write(message.buffer, 0, message.length);
  std.out.flush();
  return true;
}

function main() {
  while (true) {
    let message = getMessage();
    sendMessage(encodeMessage(message));
  }
}
try {
  main();
} catch (e) {
  std.exit(0);
}
