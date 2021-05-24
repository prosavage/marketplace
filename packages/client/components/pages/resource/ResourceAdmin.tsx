import styled from "styled-components";
import PropsTheme from "../../../styles/theme/PropsTheme";
import { Resource } from "../../../types/Resource";

export default function ResourceAdmin(props: { resource?: Resource }) {
  return (
    <Wrapper>
        <h1>Admin Controls</h1>
        <p>Dont work yet lol :D</p>
      <input type="checkbox" id="test1" />
      <label htmlFor="test1">Feature Resource</label>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  border: 1px solid ${(props: PropsTheme) => props.theme.borderColor};
  border-radius: 4px;
  padding: 1em;
  margin: 1em 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;
