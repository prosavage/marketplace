import { Tag } from "bbcode-to-react";

export default class LinkTag extends Tag {
  constructor(renderer, settings = {}) {
    super(renderer, settings);
  }

  toReact() {
    let url = this.renderer.strip(this.params["URL"] || this.getContent(true));

    if (/javascript:/i.test(url)) {
      url = "";
    }

    if (!url || !url.length) {
      return this.getComponents();
    }

    if (this.name === "email") {
      url = `mailto:${url}`;
    }

    return (
      <a href={url} target="_blank" rel="noopener noreferrer">
        {this.getComponents()}
      </a>
    );
  }
}
