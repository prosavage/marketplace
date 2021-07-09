import { ResourceType } from "@savagelabs/types/src/Resource";
import Head from "next/head";
import styled from "styled-components";
import FeaturedPlugins from "../components/views/home/featured/FeaturedPlugins";
import ResourcesView from "../components/views/home/ResourcesView";
import SubNavbar from "../components/views/home/SubNavbar";


export default function Home() {
    return (
        <>
            <Head>
                <title>Marketplace</title>
                <meta name="description" content="Marketplace"/>
            </Head>
            <SubNavbar/>
            <Wrapper>
                <FeaturedPlugins/>
                <ResourcesView type={ResourceType.PLUGIN} category={undefined}/>
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
