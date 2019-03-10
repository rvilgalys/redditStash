const redditFeedUrl = "https://www.reddit.com/prefs/feeds";

const getRedditStashAPI = callback => {
  chrome.storage.sync.get(["redditStashKey"], callback);
};

const setRedditStashAPI = apiKey => {
  chrome.storage.sync.set({ redditStashKey: apiKey }, () => {
    console.log(`setting apiKey to ${apiKey}`);
  });
};

const extractKey = sampleURL => {
  const runRegEx = /feed=(.*?)&user/;

  const result = runRegEx.exec(sampleURL)[1];
  console.log(result);
  return result;
};

const getKeyFromFeed = feedURL => {
  const xhr = new XMLHttpRequest();

  xhr.open("GET", feedURL, true);
  xhr.responseType = "document";
  xhr.onreadystatechange = request => {
    if (xhr.readyState !== 4 || xhr.status !== 200) return;
    const elements = request.currentTarget.response.getElementsByClassName(
      "json-link"
    );
    const key = extractKey(elements[0].href);

    setRedditStashAPI(key);
  };

  xhr.send();
};

getKeyFromFeed(redditFeedUrl);
