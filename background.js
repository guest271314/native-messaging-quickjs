/*
globalThis.name = chrome.runtime.getManifest().short_name;

globalThis.port = chrome.runtime.connectNative(globalThis.name);
port.onMessage.addListener((message) => console.log(message));
port.onDisconnect.addListener((p) => console.log(chrome.runtime.lastError));
port.postMessage(new Array(209715));

chrome.runtime.onInstalled.addListener((reason) => {
  console.log(reason);
});
*/

const connectExternal = (id)=>{
  globalThis.port = chrome.runtime.connect(id, {
    name: id
  });
  port.onMessage.addListener((message)=>{
    console.log(message);
  }
  );
  port.onDisconnect.addListener((e)=>{
    console.log(e);
  }
  );
  port.postMessage('Externally connected');
}

const setExternallyConnectable = async(set_externally_connectable=["https://example.com/*"],unset_externally_connectable=false)=>{
  return new Promise(async(resolve)=>{
    let permission = await navigator.permissions.request({
      name: 'notifications',
    });
    if (permission.state === 'granted') {

      const saveFileNotification = new Notification('Allow file editing?',{
        body: `Select manifest.json for extension`
      });
      saveFileNotification.onclick = async(e)=>{
        const dir = await showDirectoryPicker({
          mode: 'readwrite'
        });
        const fileHandle = await dir.getFileHandle("manifest.json", {
          create: false
        });
        const file = await fileHandle.getFile();
        console.log(file);
        let text = await file.text();
        const manifest_json = JSON.parse(text);
        manifest_json.externally_connectable.matches = unset_externally_connectable ? set_externally_connectable : [...manifest_json.externally_connectable.matches, ...set_externally_connectable];
        const writer = await fileHandle.createWritable({
          keepExistingData: false
        });
        await writer.write(JSON.stringify(manifest_json, null, 2));
        await writer.close();
        resolve();
      }
    }
  }
  );
}
;

chrome.runtime.onInstalled.addListener(async({reason})=>{
  const {id} = (await chrome.storage.local.get('id'));
  if (reason === 'update' && id) {
    await chrome.scripting.executeScript({
      target: {
        tabId: id,
      },
      world: 'MAIN',
      args: [chrome.runtime.id],
      func: connectExternal,
    });

  }
}
);

chrome.runtime.onConnectExternal.addListener((p)=>{
  globalThis.name = chrome.runtime.getManifest().short_name;
  globalThis.port = chrome.runtime.connectNative(globalThis.name);
  port.onMessage.addListener((message)=>{
    p.postMessage(message);
  }
  );
  port.onDisconnect.addListener((p)=>console.log(chrome.runtime.lastError));

  p.onMessage.addListener(async(message)=>{
    console.log(message);

    if (message === 'disconnect') {
      port.disconnect();
      p.disconnect();
      await chrome.storage.local.clear();
      return;
    }
    port.postMessage(message);
  }
  );
  p.onDisconnect.addListener(async(e)=>{
    console.log(e);
    port.disconnect();
    await chrome.storage.local.clear();
    return;
  }
  );
}
);

chrome.action.onClicked.addListener(async(tab)=>{
  const url = new URL(tab.url);
  const manifest = chrome.runtime.getManifest();
  console.log(url.origin, manifest);
  await chrome.storage.local.set({
    'id': tab.id
  });
  if (manifest.externally_connectable.matches.some((match)=>match.includes(url.origin))) {
    chrome.runtime.onInstalled.dispatch({
      reason: 'update'
    })
    return;
  }
  const [{result}] = await chrome.scripting.executeScript({
    target: {
      tabId: tab.id,
    },
    world: 'MAIN',
    args: [[`${url.origin}/*`], false],
    func: setExternallyConnectable,
  });
  console.log(result);
  chrome.runtime.reload();
}
);
