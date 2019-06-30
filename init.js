import {
  chromeStorageSyncGetAsync,
  chromeStorageLocalSetAsync,
  chromeStorageLocalGetAsync,
  chromeStorageSyncSetAsync
} from "./src/chromeAsyncUtils.js";
import fetchFromFeed from "./src/fetchFromFeed.js";
import "./components/stash-view.js";

window.addEventListener("load", async () => {
  //fetchFeed();
  init();
  runUpdate();
  document
    .querySelector("#button-refresh")
    .addEventListener("click", async () => {
      await runUpdate();
    });
});

const init = async () => {
  try {
    // *** first check for local storage and render if it's there ***
    const localStash = await chromeStorageLocalGetAsync([
      "redditStashLocalStorage"
    ]);
    updateStashView(localStash);
  } catch (err) {
    // *** FALLBACK -- nothing in local storage, let's fetch it all
    const newLocalStashLinks = await completeStash();
    const newLocalStash = {
      links: newLocalStashLinks,
      latestID: newLocalStashLinks[0].data.name
    };
    try {
      // *** store local stash
      await chromeStorageLocalSetAsync({
        redditStashLocalStorage: newLocalStash
      });
      updateStashView(newLocalStash);
    } catch (error) {
      console.error(error);
    }
  }
};

const runUpdate = async () => {
  const localStash = await chromeStorageLocalGetAsync([
    "redditStashLocalStorage"
  ]);
  const latestID = localStash.redditStashLocalStorage.latestID;

  const newLinks = await fetchCompareChanges(latestID);
  if (!newLinks.length) return;

  const newStash = await addLinksToStash(newLinks);
  await updateStashView(newStash);
};

const fetchCompareChanges = async latestID => {
  const latestStashFetch = await fetchFromFeed();
  const changed = latestStashFetch[0].data.name !== latestID;
  if (!changed) return [];
  const indexOfMatch = latestStashFetch.findIndex(
    item => item.data.name === latestID
  );
  return indexOfMatch >= 0
    ? latestStashFetch.slice(0, indexOfMatch)
    : latestStashFetch;
};

const addLinksToStash = async newLinks => {
  const localStash = await chromeStorageLocalGetAsync([
    "redditStashLocalStorage"
  ]);
  try {
    console.log(newLinks);
    const newLocalStash = {
      links: [...newLinks, ...localStash.redditStashLocalStorage.links],
      latestID: newLinks[0].data.name
    };
    await chromeStorageLocalSetAsync({
      redditStashLocalStorage: newLocalStash
    });
    return { redditStashLocalStorage: newLocalStash };
  } catch (err) {
    console.error(err);
  }
};

const updateStashView = async localStash => {
  const data = localStash
    ? localStash
    : await chromeStorageLocalGetAsync(["redditStashLocalStorage"]);
  const content = document.querySelector("#content");
  const stashView = document.querySelector("stash-view")
    ? document.querySelector("stash-view")
    : document.createElement("stash-view");
  stashView.data = data.redditStashLocalStorage;
  content.appendChild(stashView);
  return;
};

const completeStash = async () => {
  return await fetchFromFeed({
    limit: 100,
    after: "",
    runRecursive: true
  });
};
