import styled from "styled-components";
import PropsTheme from "../../../styles/theme/PropsTheme";
import { Version } from "../../../types/Version";
import timeago from "time-ago";
import React from "react";
import Button from "../../ui/Button";
import parser from "./../../../util/parser/Parser"
import { animated, useSpring } from "react-spring";

export default function ResourceVersionEntry({
  version,
}: {
  version: Version;
}) {

  const anime = useSpring({
    config: {duration: 250},
    opacity: 1,
    from: {opacity: 0.5}
  })

  return (
    <Wrapper style={anime}>
      <Header>
        <TextContainer>
          <h3>{version.title}</h3>
          <p>{timeago.ago(version.timestamp)}</p>
          <p>v{version.version}</p>
        </TextContainer>
        <ButtonContainer>
          <Button>
            <p>Download</p>
          </Button>
        </ButtonContainer>
      </Header>
      {parser.toReact(version.description)}
    </Wrapper>
  );
}

const Wrapper = styled(animated.div)`
  display: flex;
  flex-direction: column;
  border: 1px solid ${(props: PropsTheme) => props.theme.borderColor};
  padding: 1em;
  margin-top: 1em;
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
