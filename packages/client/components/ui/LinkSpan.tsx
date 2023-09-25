import Link, { LinkProps } from "next/link";
import React, { JSXElementConstructor, ReactElement } from "react";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { themeState } from "../../atoms/theme";
import PropsTheme from "../../styles/theme/PropsTheme";

type LinkSpanProps = {
  children: any
} & LinkProps

export const LinkSpan: React.FC<LinkSpanProps> = ({ href, children, ...props }) => {
  const theme = useRecoilValue(themeState);

  return (
    <Link href={href} {...props}>
      <Span>{children}</Span>
    </Link>
  );
};

const Span = styled.span`
  color: ${(props: PropsTheme) => props.theme.accentColor};
  &:hover {
    cursor: pointer;
  }
`;