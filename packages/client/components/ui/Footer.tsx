import Link from "next/link";
import styled from "styled-components";
import PropsTheme from "../../styles/theme/PropsTheme";
function Footer() {
  return (
    <Wrapper>
      <Code>
        Marketplace Beta {process.env.NEXT_PUBLIC_GIT_BRANCH}-
        {process.env.NEXT_PUBLIC_GIT_SHA}
      </Code>
      <LinkWrapper>
        <Link href={"https://prosavage.net"}>By ProSavage</Link>
      </LinkWrapper>
    </Wrapper>
  );
}

export default Footer;

const Wrapper = styled.div`
  width: 100vw;
  bottom: 0;
  position: fixed;
  padding: 5px;
  flex-shrink:0;
  /* Want a line instead of shadow in dark mode. */
  background: ${(props: PropsTheme) => props.theme.backgroundPrimary};
  border-top: 1px solid ${(props: PropsTheme) => props.theme.borderColor};

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const Icons = styled.div`
  display: flex;
  flex-direction: row;
`;

const Code = styled.p`
  padding-left: 10px;
  font-size: 14px;
  @media (max-width: 600px) {
    display: none;
  }
`;

const LinkWrapper = styled.div`
  padding-right: 2em;
`;
