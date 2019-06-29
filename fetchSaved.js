import "./saved-link.js";

window.addEventListener("load", async () => {
  //fetchFeed();
  const stash = await fetchFromFeed({
    limit: 100,
    after: "",
    runRecursive: true
  });
  console.log(stash);
});

const generateStashUrl = apiKey => {
  return `https://www.reddit.com/saved.json?feed=${apiKey}`;
};

const chromseStorageSyncGetAsync = keys => {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get([...keys], result => {
      if (chrome.runtime.lastError) reject(chrome.runtime.lastError);
      resolve(result);
    });
  });
};

const fetchFromFeed = async (
  options = {
    limit: 25,
    after: "",
    runRecursive: false
  }
) => {
  try {
    const baseURLObj = await chromseStorageSyncGetAsync(["redditStashBaseURL"]);
    const baseURL = baseURLObj.redditStashBaseURL;
    const url = new URL(baseURL);

    url.searchParams.set("limit", options.limit);
    if (options.after) url.searchParams.set("after", options.after);

    const res = await fetch(url);
    const json = await res.json();

    if (json.data.after && options.runRecursive) {
      const nextResult = await fetchFromFeed({
        limit: options.limit,
        after: json.data.after,
        runRecursive: options.runRecursive
      });
      const combinedResult = [...json.data.children, ...nextResult];
      return combinedResult;
    }

    return json.data.children;
  } catch (err) {
    console.error(err);
  }
};
