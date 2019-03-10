class SavedLink extends HTMLElement {
  set data(data) {
    this.innerHTML = `
        <div class="saved-link">
        
            <a href="${data.url}">
                <img src="./baseline-bookmark-24px.svg">
                <p>${data.title}</p>
            </a>
        </div>`;
  }
}

customElements.define("saved-link", SavedLink);
