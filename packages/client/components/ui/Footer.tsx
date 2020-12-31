import styled from 'styled-components';
import PropsTheme from '../../styles/theme/PropsTheme';
import Link from "next/link";

function Footer() {
    return <Wrapper>
        <Code>{process.env.NEXT_PUBLIC_GIT_BRANCH}-{process.env.NEXT_PUBLIC_GIT_SHA.substring(0, 4)}</Code>
        <LinkWrapper>
            <Link href={"https://prosavage.net"}>By ProSavage</Link>
        </LinkWrapper>
    </Wrapper>
}

export default Footer;


const Wrapper = styled.div`
    width: 100vw;
    z-index: 1;
    position: fixed;
    bottom: 0;
    background-color: green;

    padding: 5px;

    /* Want a line instead of shadow in dark mode. */
    background: ${(props: PropsTheme) => props.theme.background};
    border-top: 1px solid ${(props: PropsTheme) => props.theme.borderColor};

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`

const Code = styled.p`
    padding-left: 10px;
    font-size: 14px;
`

const LinkWrapper = styled.div`
    padding-right: 10px;
`