import Head from "next/head";
import styled from "styled-components";
import Categories from "../components/pages/home/categories/Categories";
import FeaturedPlugins from "../components/pages/home/featured/FeaturedPlugins";
import ResourceList from "../components/pages/home/resourcelist/ResourceList";
import PropsTheme from "../styles/theme/PropsTheme";
export default function Home() {
  return (
    <>
      <Wrapper>
        <FeaturedPlugins />
        <Content>
          <CategoriesContainer>
            <Categories />
          </CategoriesContainer>
          <ResourcesContainer>
            <ResourceList />
          </ResourcesContainer>
        </Content>
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
`;

const Content = styled.div`
  display: flex;
  flex-direction: row;
  margin: 1em 0;
  width: 100%;

  @media (max-width: 1150px) {
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
`;

const CategoriesContainer = styled.div`
  flex-basis: 25%;

  @media (max-width: 1150px) {
    flex-basis: auto;
    width: 100%;
  }
`;

const ResourcesContainer = styled.div`
  width: 100%;
  margin-left: 1em;

  @media(max-width: 1150px) {
    margin: 1em 0;
  }
`;
