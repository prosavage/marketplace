import {useRouter} from "next/router";
import styled from "styled-components";
import getAxios from "../../../util/AxiosInstance";
import Head from "next/head";

export default function Success(props: { resource: null }) {


    const router = useRouter();


    return (
        <Wrapper>
          <Head>
            <title>Purchase Successful - Marketplace</title>
            <meta name="description" content="Dashboard" />
          </Head>
            <ImageContainer>
                <Splash src={"/marketplace/static/splash/checkout_success_splash.svg"}/>
            </ImageContainer>
            <h1>Purchase Successful</h1>
            <h2>You have purchased ___</h2>
        </Wrapper>
    );
}

export async function getServerSideProps({params}) {
    const id = params.id as string;

    try {
        const resource = await getAxios().get(`/resources/${id}`)
        return {props: {resource: resource.data.payload.resource}}
    } catch (e) {
        return {props: {resource: null}}
    }


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

  max-width: 550px;

  @media (max-width: 600px) {
    max-width: 200px;
  }
`

