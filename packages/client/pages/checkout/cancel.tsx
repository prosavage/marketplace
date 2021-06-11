import {useRouter} from "next/router";
import styled from "styled-components";
import Head from "next/head";

export default function Cancel() {


    const router = useRouter();


    return (
        <Wrapper>
          <Head>
            <title>Purchase Canceled - Marketplace</title>
            <meta name="description" content="Dashboard" />
          </Head>
            <ImageContainer>
                <Splash src={"/marketplace/static/splash/checkout_cancel_splash.svg"}/>
            </ImageContainer>
            <h1>Purchase Cancelled</h1>
            <h2>You left the page or the session expired.</h2>
        </Wrapper>
    );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 2em;
  margin: 1em 0;
`;

const ImageContainer = styled.div`
  padding: 2em 0;
`


const Splash = styled.img`

  max-width: 450px;

  @media(max-width: 600px) {
    max-width: 200px;
  }
`
