class SavedLink extends HTMLElement {
  set data(data) {
    this.innerHTML = `<span class="saved-link-item saved-link-title">${
      data.title ? data.title : `Comment by u/${data.author}`
    }</span>
    <span class="saved-link-item saved-link-domain">${
      data.domain ? data.domain : `self/r/${data.subreddit}`
    }</span>`;
    this.classList.add("saved-link");
    this.addEventListener("click", () => {
      window.open(data.url ? data.url : data.link_permalink, "_blank");
    });

    const subredditLink = document.createElement("span");
    subredditLink.classList.add("subreddit-link", "saved-link-item");
    subredditLink.innerText = data.subreddit_name_prefixed;
    subredditLink.addEventListener("click", () => {
      window.open(`http://reddit.com/${data.permalink}`, "_blank");
    });
    this.appendChild(subredditLink);
  }
}

customElements.define("saved-link", SavedLink);
