import Link, { LinkProps } from "next/link";
import React from "react";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { themeState } from "../../atoms/theme";
import PropsTheme from "../../styles/theme/PropsTheme";

export const LinkSpan: React.FC<LinkProps> = ({ href, ...props }) => {
  const theme = useRecoilValue(themeState);

  return (
    <Link href={href} {...props}>
      <Span>{props.children}</Span>
    </Link>
  );
};

const Span = styled.span`
  color: ${(props: PropsTheme) => props.theme.accentColor};
  &:hover {
    cursor: pointer;
  }
`;
