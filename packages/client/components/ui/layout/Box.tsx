import styled, { css } from "styled-components";
import PropsTheme from "../../../styles/theme/PropsTheme";

interface BoxProps {
    width?: string;
    maxWidth?: string;
}


export const Box = styled.div`
    ${(props: BoxProps) => props.width && css`
        width: ${(props: BoxProps) => props.width};
    `}

    ${(props: BoxProps) => props.maxWidth && css`
        maxWidth: ${(props: BoxProps) => props.maxWidth};
    `}

`