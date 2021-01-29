import { useState } from "react";
import styled from "styled-components";
import PropsTheme from "../../../styles/theme/PropsTheme";
import { Resource } from "../../../types/Resource";

export default function ResourceUpdate({ resource }: { resource: Resource }) {
  const [title, setTitle] = useState("");

  return (
    <Wrapper>
      <InputWrapper>
        <label>UPDATE TITLE</label>
        <input
          placeholder={"Update Title"}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </InputWrapper>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1em;
  border: 1px solid ${(props: PropsTheme) => props.theme.borderColor};
  border-radius: 4px;
  margin: 1em 0;
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 1em 0;
`;
