#!/usr/bin/env -S ./qjs -m --std
// QuickJS Native Messaging host
// guest271314, 6-19-2022
import * as std from 'std';

function getMessage() {
  const header = new Uint32Array(1);
  std.in.read(header.buffer, 0, header.byteLength);
  const length = header[0];
  const output = new Uint8Array(length);
  std.in.read(output.buffer, 0, length);
  return output;
}

function sendMessage(json) {
  const header = Uint32Array.from(
    {
      length: 4,
    },
    (_, index) => (json.length >> (index * 8)) & 0xff
  );
  std.out.write(header.buffer, 0, header.length);
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
