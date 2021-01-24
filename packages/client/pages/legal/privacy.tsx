import Head from "next/head";
import styled from "styled-components";
import LegalNavbar from "../../components/pages/legal/LegalNavbar"
import PropsTheme from "../../styles/theme/PropsTheme";
export default function Privacy() {
  return (
    <>
    <LegalNavbar />
      <Wrapper>
          <h1>Privacy Policy</h1>
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

