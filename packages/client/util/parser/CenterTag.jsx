import React from "react";
import { Tag } from "bbcode-to-react";
import styled from "styled-components";
export default class CenterTag extends Tag {
  constructor(renderer, settings = {}) {
    super(renderer, settings);
  }
  toReact() {
    return <Wrapper>{this.getComponents()}</Wrapper>;
  }
}

const Wrapper = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
