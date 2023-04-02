#!/usr/bin/env -S ./qjs -m --std
import { webserver } from './webserver.so';
try {
  webserver('parec -d @DEFAULT_MONITOR@', (status) => {
    if (status === 'aborted') {
      std.exit(0);
    }
  });
} catch (e) {
  console.log(e);
}
