QuickJS Native Messaging host

Dynamic externally connectable usage: 

Pin extension icon to toolbar. Click the icon on Web pages where the origin is intended to be pushed to `"matches"` array in `"externally_connectable"` object is `manifest.json`, select the extension directory in show and edit directory picker. 

Once the origin is added to `"matches"` `port` will be defined in the `Window` globally. The messages sent to the `port` on the Web page will be sent to the extension `ServiceWorker` and then sent to Native Messaging host. The messages received by the Native Messaging client in the extension `ServiceWorker` will be sent to the externally connectable `port` defined globally on the Web page. The `"externally_connectable"` port and Native Messaging port use JSON based data structure, e.g., `port.postMessage(new Array(209715))`, `port.postMessage(null)` will echo back the value, `port.postMessage(new Set([1]))` will be serialized to a plain JavaScript object `{}`.

To unset the origin execute `setExternallyConnectable` function located in `background.js` on a Web page, selecting extension directory at directory picker, with empty array, or array containing origins to replace array of current origins at first parameter, `true` at second parameter:
```
setExternallyConnectable([], true)
```
