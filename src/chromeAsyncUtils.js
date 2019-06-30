const chromeStorageSyncGetAsync = keys => {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get([...keys], result => {
      if (chrome.runtime.lastError) reject(chrome.runtime.lastError);
      if (!Object.keys(result).length) reject("No matching object found");
      resolve(result);
    });
  });
};

const chromeStorageLocalGetAsync = keys => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get([...keys], result => {
      console.log(result);
      if (chrome.runtime.lastError) reject(chrome.runtime.lastError);
      if (!Object.keys(result).length) reject("No matching object found");
      resolve(result);
    });
  });
};

const chromeStorageSyncSetAsync = keyValueObj => {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.set(keyValueObj, () => {
      if (chrome.runtime.lastError) reject(chrome.runtime.lastError);
      resolve();
    });
  });
};

const chromeStorageLocalSetAsync = keyValueObj => {
  return new Promise((resolve, reject) => {
    console.log(keyValueObj);
    chrome.storage.local.set(keyValueObj, () => {
      if (chrome.runtime.lastError) reject(chrome.runtime.lastError);
      resolve();
    });
  });
};

export {
  chromeStorageLocalGetAsync,
  chromeStorageLocalSetAsync,
  chromeStorageSyncSetAsync,
  chromeStorageSyncGetAsync
};
