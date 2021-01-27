import styled from "styled-components";
import PropsTheme from "../../../styles/theme/PropsTheme";
import { Version } from "../../../types/Version";
import timeago from "time-ago";
import React from "react";
import Button from "../../ui/Button";
import parser from "./../../../util/parser/Parser";
import { animated, useSpring } from "react-spring";
import { Resource } from "../../../types/Resource";
import { useRouter } from "next/router";

export default function ResourceVersionEntry({
  version,
  onVersionSelect,
}: {
  onVersionSelect: (version: Version) => void;
  version: Version;
}) {
  const router = useRouter();

  const anime = useSpring({
    config: { duration: 125 },
    opacity: 1,
    from: { opacity: 0.5 },
  });

  return (
    <Wrapper onClick={() => onVersionSelect(version)} style={anime}>
      <Header>
        <TextContainer>
          <h3>{version?.title}</h3>
          <p>{timeago.ago(version?.timestamp)}</p>
          <p>v{version?.version}</p>
        </TextContainer>
        <ButtonContainer>
          <Button onClick={(e) => e.stopPropagation()}>
            <p>Download</p>
          </Button>
        </ButtonContainer>
      </Header>
      {version && parser.toReact(version?.description)}
    </Wrapper>
  );
}

const Wrapper = styled(animated.div)`
  display: flex;
  flex-direction: column;
  border: 1px solid ${(props: PropsTheme) => props.theme.borderColor};
  padding: 1em;
  margin: .5em 0;
  transition: 250ms ease-in-out;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    border: 1px solid ${(props: PropsTheme) => props.theme.accentColor};
  }
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;
