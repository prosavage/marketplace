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

    // strip fn putting ` ` around the URL, i dont give a fuck just remove.
    url = url.substring(1);
    url = url.substring(0, url.length - 1);
    return (
      <a href={url} target="_blank" rel="noopener noreferrer">
        {this.getComponents()}
      </a>
    );
  }
}
