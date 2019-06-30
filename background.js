import { chromeStorageSyncSetAsync } from "./src/chromeAsyncUtils.js";

const redditFeedUrl = "https://www.reddit.com/prefs/feeds";

const setRedditStashBaseURL = baseURL => {
  chrome.storage.sync.set({ redditStashBaseURL: baseURL });
};

const getKeyFromFeed = feedURL => {
  chrome.storage.sync.get({ redditStashBaseURL: "" }, async result => {
    if (result.redditStashBaseURL !== "") return;

    const xhr = new XMLHttpRequest();

    xhr.open("GET", feedURL, true);
    xhr.responseType = "document";
    xhr.onreadystatechange = request => {
      if (xhr.readyState !== 4 || xhr.status !== 200) return;
      const elements = [
        ...request.currentTarget.response.getElementsByClassName("json-link")
      ];
      const savedLinkFeed = elements.find(element => {
        return /saved.json/.test(element);
      });
      await chromeStorageSyncSetAsync({ redditStashBaseURL: savedLinkFeed.href });
      console.log('initial baseURL scraped');
    };

    xhr.send();
  });
};

getKeyFromFeed(redditFeedUrl);
