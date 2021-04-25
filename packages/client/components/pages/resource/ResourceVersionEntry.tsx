import FileDownload from "js-file-download";
import React from "react";
import styled, { css } from "styled-components";
import timeago from "time-ago";
import PropsTheme from "../../../styles/theme/PropsTheme";
import { Resource } from "../../../types/Resource";
import { Version } from "../../../types/Version";
import getAxios from "../../../util/AxiosInstance";
import useToast from "../../../util/hooks/useToast";
import Button from "../../ui/Button";
import FadeDiv from "../../ui/FadeDiv";
import parser from "./../../../util/parser/Parser";

export default function ResourceVersionEntry({
  resource,
  version,
  onVersionSelect,
}: {
  resource: Resource;
  onVersionSelect: (version: Version) => void;
  version: Version;
}) {
  const toast = useToast();

  const download = () => {
    getAxios()
      .get(`directory/versions/download/${version._id}`)
      .then((res) => {
        FileDownload(
          res.data,
          version.fileName
            ? version.fileName
            : `${resource.name}-${version.version}.jar`
        );
      })
      .catch((err) => {
        toast(err.response.data.error);
      });
  };

  return (
    <Wrapper onClick={() => onVersionSelect(version)}>
      <Header>
        <TextContainer>
          <h3>{version?.title}</h3>
          <p>{timeago.ago(version?.timestamp)}</p>
          <p>v{version?.version}</p>
        </TextContainer>
        <ButtonContainer>
          <DownloadButton
            isDev={version?.isDev}
            onClick={(e) => {
              e.stopPropagation();
              download();
            }}
          >
            <p>Download</p>
          </DownloadButton>
        </ButtonContainer>
      </Header>
      {version && parser.toReact(version?.description)}
    </Wrapper>
  );
}

const Wrapper = styled(FadeDiv)`
  display: flex;
  flex-direction: column;
  width: 100%;
  border: 1px solid ${(props: PropsTheme) => props.theme.borderColor};
  padding: 1em;
  margin: 0.5em 0;
  transition: 250ms ease-in-out;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    border: 1px solid ${(props: PropsTheme) => props.theme.accentColor};
  }
`;

const DownloadButton = styled(Button)`
  ${(props: { isDev: boolean }) =>
    props.isDev &&
    css`
      color: ${(props: PropsTheme) => props.theme.betaVersionColor};
      &:hover {
        border: 1px solid ${(props: PropsTheme) => props.theme.betaVersionColor};
      }
    `}
`;

const TagContainer = styled.div`
  display: flex;
`;

const VersionTag = styled.p`
  padding: 0.1em 0.5em;
  margin: 0.1em 0;

  background-color: ${(props: PropsTheme) => props.theme.stableVersionColor};

  ${(props: any) =>
    props.isDev &&
    css`
      background-color: ${(props: PropsTheme) => props.theme.betaVersionColor};
    `}

  border-radius: 5px;
  color: white;
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;
