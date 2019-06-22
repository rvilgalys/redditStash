import "./saved-link.js";

window.addEventListener("load", () => {
  fetchFeed();
});

const generateStashUrl = apiKey => {
  return `https://www.reddit.com/saved.json?feed=${apiKey}`;
};

async function fetchFeed() {
  chrome.storage.sync.get(["redditStashKey"], async result => {
    const res = await fetch(generateStashUrl(result.redditStashKey));
    const json = await res.json();

    const main = document.querySelector("main");

    json.data.children.forEach(element => {
      const el = document.createElement("saved-link");
      el.data = element.data;
      console.log(element.data);
      main.appendChild(el);
    });
  });
}
