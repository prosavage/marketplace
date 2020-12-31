import { createGlobalStyle } from "styled-components";
import PropsTheme from "./theme/PropsTheme";

const GlobalStyle = createGlobalStyle`

    body {
        transition: 250ms all;
        color: ${(props: PropsTheme) => props.theme.color};
        background: ${(props: PropsTheme) => props.theme.backgroundPrimary};
        padding: 0;
        margin: 0;
        font-family: 'Poppins', -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
            Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
    }

    * {
        box-sizing: border-box;
        margin: 0;
    }

    a {
        color: ${(props: PropsTheme) => props.theme.color};
        text-decoration: none;
    }

    p {
        font-size: 20px;
        line-height: 29px;
    }

    h1 {
        font-size: 30px;
    }

    h2 {
        font-size: 24px;
        font-weight: 600;
    }
`

export default GlobalStyle;