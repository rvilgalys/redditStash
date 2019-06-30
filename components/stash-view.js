import "./saved-link.js";

class StashView extends HTMLElement {
  set data(data) {
    this._data = data;
  }

  get data() {
    return this._data;
  }

  set items(number) {
    this.setAttribute("items", number);
  }

  get items() {
    return this.hasAttribute("items") ? this.getAttribute("items") : 25;
  }

  get page() {
    return this.hasAttribute("page") ? this.getAttribute("page") : 0;
  }

  set page(pageNum) {
    if (typeof pageNum !== "number") return;
    this.setAttribute("page", pageNum);
  }

  set searchFilter(filter) {
    this.setAttribute("filter", filter);
  }

  get searchFilter() {
    return this.hasAttribute("filter") ? this.getAttribute("filter") : "";
  }

  get filteredLinks() {
    if (!this.searchFilter) return this.data.links;

    const regex = new RegExp(this.searchFilter, "gi");

    return this.data.links.filter(link => {
      return (
        (link.data.author && link.data.author.match(regex)) ||
        (link.data.title && link.data.title.match(regex)) ||
        (link.data.subreddit && link.data.subreddit.match(regex)) ||
        (link.data.body && link.data.body.match(regex)) ||
        (link.data.selfText && link.data.selfText.match(regex))
      );
    });
  }

  connectSearchInput() {
    const searchInput = document.querySelector("#search");
    searchInput.addEventListener("input", event => {
      this.searchFilter = event.srcElement.value;
    });
  }

  connectedCallback() {
    this.render();
    this.connectSearchInput();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "filter") this.render();
  }

  static get observedAttributes() {
    return ["filter", "page", "items"];
  }

  render() {
    const prevContainer = document.querySelector("#content-container");
    if (prevContainer) this.removeChild(prevContainer);

    const pageLinks = this.filteredLinks
      .slice(this.page, this.page + 1 * this.items + 1)
      .map(item => item.data);
    const container = document.createElement("div");
    container.id = "content-container";
    pageLinks.forEach(linkData => {
      const savedLink = document.createElement("saved-link");
      savedLink.data = linkData;

      container.appendChild(savedLink);
    });
    this.appendChild(container);
  }
}

customElements.define("stash-view", StashView);
