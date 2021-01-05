import Head from 'next/head'
import styled from "styled-components";
import Categories from '../components/pages/home/featured/Categories';
import FeaturedPlugins from '../components/pages/home/featured/FeaturedPlugins';
import PropsTheme from '../styles/theme/PropsTheme';
export default function Home() {
  return (
    <>
      <Wrapper>
        <FeaturedPlugins/>
        <Content>
          <Categories/>
        </Content>
      </Wrapper>
    </>
  )
}


const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  padding: 2em;
`

const Content = styled.div`
  display: flex;
  flex-direction: row;
  margin: 1em 0;
  width: 100%;
`