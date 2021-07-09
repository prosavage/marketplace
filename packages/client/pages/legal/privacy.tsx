import Head from "next/head";
import styled from "styled-components";
import LegalNavbar from "../../components/views/legal/LegalNavbar"

export default function Privacy() {
    return (
        <>
            <Head>
                <title>Legal - Privacy Policy</title>
                <meta name="description" content="Privacy Policy"/>
            </Head>
            <LegalNavbar/>
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

