import { createGlobalStyle } from "styled-components";
import PropsTheme from "./theme/PropsTheme";

const GlobalStyle = createGlobalStyle`

    body {
        transition: 250ms all;
        overflow-x: hidden;
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
        font-size: 15px;
        line-height: 29px;
        font-family: 'Poppins', -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
            Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
    }

    h1 {
        font-size: 30px;
    }

    h2 {
        font-size: 24px;
        font-weight: 600;
    }

    h3 {
        font-size: 20px;
        font-weight: 600;
    }


    input {
        padding: 10px 15px;
        outline: none;
        border: 1px solid ${(props: PropsTheme) => props.theme.borderColor};
        border-bottom: 4px solid ${(props: PropsTheme) =>
          props.theme.accentColor};
        border-radius: 4px;    
        font-family: 'Poppins', -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
            Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
         background-color: ${(props: PropsTheme) =>
           props.theme.backgroundPrimary};  
           color: ${(props: PropsTheme) => props.theme.color}; 
    }
`;

export default GlobalStyle;
