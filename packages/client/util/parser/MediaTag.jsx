import React from "react";
import { Tag } from "bbcode-to-react";

export default class MediaTag extends Tag {
  constructor(renderer, settings = {}) {
    super(renderer, settings);
  }

  toReact() {
    const ytID = this.getContent(true);
    return (
        <object 
            width={this.params.width || "100%"}
            height={this.params.height || "450px"}
            data={`https://www.youtube.com/embed/${ytID}`}>
        </object>
    
    );
  }
}
