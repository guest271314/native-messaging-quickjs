QuickJS Native Messaging host

Installation and usage on Chrome and Chromium

1. Navigate to `chrome://extensions`.
2. Toggle `Developer mode`.
3. Click `Load unpacked`.
4. Select native-messaging-quickjs folder.
5. Note the generated extension ID.
6. Open `nm_qjs.json` in a text editor, set `"path"` to absolute path of `nm_qjs.js` and `chrome-extension://<ID>/` using ID from 5 in `"allowed_origins"` array. 
7. Copy the `nm_qjs.json` file to Chrome or Chromium configuration folder, e.g., Chromium on \*nix `~/.config/chromium/NativeMessagingHosts`; Chrome dev channel on \*nix `~/.config/google-chrome-unstable/NativeMessagingHosts`.
8. Make sure `qjs` executable and `nm_qjs.js` are executable.
9. To test click `service worker` link in panel of unpacked extension which is DevTools for `background.js` in MV3 `ServiceWorker`, observe echo'ed message from txiki.js Native Messaging host. To disconnect run `port.disconnect()`.

The Native Messaging host echoes back the message passed. 

For differences between OS and browser implementations see [Chrome incompatibilities](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Chrome_incompatibilities#native_messaging).

This is FOSS. If you think a license is necessary consider [WTFPLv2](http://www.wtfpl.net/about/) applicable.
