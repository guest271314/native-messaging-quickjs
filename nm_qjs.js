#!/usr/bin/env -S ./qjs -m --std
// QuickJS Native Messaging host
// guest271314, 6-19-2022
import * as std from 'std';

const length = Uint32Array.BYTES_PER_ELEMENT;

function getMessage() {
  const header = new Uint32Array(1);
  std.in.read(header.buffer, 0, length);
  const output = new Uint8Array(header[0]);
  std.in.read(output.buffer, 0, output.length);
  return output;
}

function sendMessage(json) {
  const header = new Uint32Array([json.length]);
  std.out.write(header.buffer, 0, length);
  std.out.puts(json);
  std.out.flush();
  return true;
}

function main() {  
  while (true) {
    const message = getMessage();
    sendMessage(String.fromCharCode.apply(null, message));
  }
}

try {
  main();
} catch(e) {
  std.exit(0);
}
