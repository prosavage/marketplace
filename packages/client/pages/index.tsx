import Head from 'next/head'
import styled from "styled-components";
import PropsTheme from '../styles/theme/PropsTheme';
export default function Home() {
  return (
    <>
      <Header>
        <Content>
          <h1>SPIGOT MARKETPLACE</h1>
          <p>because spigot can't decide.</p>
        </Content>
      </Header>
      <Wrapper>
        <p>Css is gay</p>
      </Wrapper>
    </>
  )
}


const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
`

const Header = styled.div`
  height: 500px;
  width: 100vw;
  background: ${(props: PropsTheme) => props.theme.borderColor};
  display: flex;
  flex-direction: row;
  align-items: center;
`

const Content = styled.div`
  padding-left: 20%;
  width: 100%;
`
