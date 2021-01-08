import { versions } from "process";
import React from "react";
import styled from "styled-components";
import PropsTheme from "../../../styles/theme/PropsTheme";
import { Resource } from "../../../types/Resource";
import { Version } from "../../../types/Version";
import Button from "../../ui/Button";
import ResourceIcon from "../../ui/ResourceIcon";

export default function ResourceHeader(props: {resource: Resource, version: Version | undefined}) {
    return <TitleContainer>
    <ResourceIcon resource={props.resource} size={"100px"} />
    <ContentContainer>
      <TextContainer>
        <HeaderContainer>
          <h1>{props.resource?.name}</h1>
          <VersionText>v{props.version?.version}</VersionText>
        </HeaderContainer>
        <Description>
          Here’s where the author would write a lovely, catchy description
          that can span up to two, maybe three lines.
        </Description>
      </TextContainer>
      <DownloadButton>
        <p>Download</p>
      </DownloadButton>
    </ContentContainer>
  </TitleContainer>
}

const TitleContainer = styled.div`
  display: flex;
  padding: 1em;
  border: 1px solid ${(props: PropsTheme) => props.theme.borderColor};
  border-radius: 4px;
  width: 100%;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-grow: 1;
  justify-content: space-between;
  align-items: center;
  margin: 0 1em;
`;
const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 500px;

`;

const Description = styled.p`
  line-height: 14px;
`;

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
`;

const VersionText = styled.p`
  margin: 0 1em;
`;
const DownloadButton = styled(Button)`
  background: black !important;
  padding: 10px 25px !important;
  color: ${(props: PropsTheme) => props.theme.accentColor} !important;
`;
