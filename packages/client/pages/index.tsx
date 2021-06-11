import { ResourceType } from "@savagelabs/types/src/Resource";
import Head from "next/head";
import { NextSeo } from "next-seo";
import styled from "styled-components";
import FeaturedPlugins from "../components/pages/home/featured/FeaturedPlugins";
import ResourcesView from "../components/pages/home/ResourcesView";
import SubNavbar from "../components/pages/home/SubNavbar";


export default function Home() {
    return (
        <>
            <NextSeo 
                title="Marketplace"
                description="Built by developers for developers"
                openGraph={{
                    url: 'https://www.url.ie/a',
                    title: 'Marketplace',
                    description: 'Built by developers for developers',
                }}
            />
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
