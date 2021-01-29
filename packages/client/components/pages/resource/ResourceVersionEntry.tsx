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
import getAxios from "../../../util/AxiosInstance";
import FileDownload from "js-file-download";

export default function ResourceVersionEntry({
  resource,
  version,
  onVersionSelect,
}: {
  resource: Resource,
  onVersionSelect: (version: Version) => void;
  version: Version;
}) {
  const anime = useSpring({
    config: { duration: 125 },
    opacity: 1,
    from: { opacity: 0.5 },
  });

  const download = () => {
    getAxios()
      .get(`directory/versions/download/${version._id}`)
      .then((res) => FileDownload(res.data, `${resource.name}-${version.version}.jar`))
      .catch((err) => console.log(err.response.data));
  };

  return (
    <Wrapper onClick={() => onVersionSelect(version)} style={anime}>
      <Header>
        <TextContainer>
          <h3>{version?.title}</h3>
          <p>{timeago.ago(version?.timestamp)}</p>
          <p>v{version?.version}</p>
        </TextContainer>
        <ButtonContainer>
          <Button onClick={(e) => {
            e.stopPropagation()
            download()
          }}>
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
