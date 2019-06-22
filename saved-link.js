class SavedLink extends HTMLElement {
  set data(data) {
    this.innerHTML = `<div class="title">${data.title}</p>
    <div class="domain">${data.domain}</p>`;
    this.classList.add("saved-link");
    this.addEventListener("click", () => {
      window.open(data.url, "_blank");
    });

    const subredditLink = document.createElement("div");
    subredditLink.classList.add("subreddit-link");
    subredditLink.innerText = data.subreddit_name_prefixed;
    subredditLink.addEventListener("click", () => {
      window.open(`http://reddit.com/${data.permalink}`, "_blank");
    });
    this.appendChild(subredditLink);
  }
}

customElements.define("saved-link", SavedLink);
