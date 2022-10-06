var port = chrome.runtime.connectNative('nm_qjs');
port.onMessage.addListener((message) => console.log(message));
port.onDisconnect.addListener((e) => console.log(e));
port.postMessage(new Array((200000)));
