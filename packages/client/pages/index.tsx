import Head from "next/head";
import styled from "styled-components";
import Categories from "../components/pages/home/categories/Categories";
import FeaturedPlugins from "../components/pages/home/featured/FeaturedPlugins";
import ResourceList from "../components/pages/home/resourcelist/ResourceList";
import ResourcesView from "../components/pages/home/ResourcesView";
import SubNavbar from "../components/pages/home/SubNavbar";
import PropsTheme from "../styles/theme/PropsTheme";
import { ResourceType } from "../types/Resource";
export default function Home() {
  return (
    <>
    <Head>
      <title>Marketplace</title>
      <meta name="description" content="Marketplace" />
    </Head>
    <SubNavbar />
      <Wrapper>
        <FeaturedPlugins />
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

