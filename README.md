QuickJS Native Messaging host

Dynamic externally connectable usage: 

Pin extension icon to toolbar. Click the icon on Web pages where the origin is intended to be pushed to `"matches"` array in `"externally_connectable"` object is `manifest.json`, select the extension directory in show and edit directory picker. 

To unset the origin execute `setExternallyConnectable` in `background.js` with empty array, or array containing origins to replace array of current origins at first parameter, `true` at second parameter.
```
setExternallyConnectable([], true)
```

using `chrome.scripting.executeScript()`.

Once the origin is added to `"matches"` `port` will be defined in the `Window` globally. The messages sent to the port will be sent to the Native Messaging host. The messages received by the Native Messaging client in `ServiceWorker` will be sent to the externally connectable port defined globally on the Web page as `port`.
