import Head from "next/head";
import styled from "styled-components";
import PropsTheme from "../styles/theme/PropsTheme";
export default function Privacy() {
  return (
    <>
      <Wrapper>
          <h1>FAQ</h1>
      </Wrapper>
    </>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  padding: 2em;
  margin: 1em 0;
`;