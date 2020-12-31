import Head from 'next/head'
import styled from "styled-components";
import FeaturedPlugins from '../components/pages/home/FeaturedPlugins';
import PropsTheme from '../styles/theme/PropsTheme';
export default function Home() {
  return (
    <>
      <Wrapper>
        <FeaturedPlugins/>
        
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
