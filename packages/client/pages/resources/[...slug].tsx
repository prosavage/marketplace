import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { ArrowLeft, TrendingUp } from "react-feather";
import styled, { css } from "styled-components";
import ResourceHeader from "../../components/pages/resource/ResourceHeader";
import Button from "../../components/ui/Button";
import PropsTheme from "../../styles/theme/PropsTheme";
import { Resource } from "../../types/Resource";
import { User } from "../../types/User";
import { Version } from "../../types/Version";
import getAxios from "../../util/AxiosInstance";
import PluginInfo from "../../components/pages/resource/PluginInfo";
import ResourceThread from "../../components/pages/resource/ResourceThread";
import DiscordInfo from "../../components/pages/resource/DiscordInfo";
import ResourceEdit from "../../components/pages/resource/ResourceEdit";
import ResourceRating from "../../components/pages/resource/ResourceRating";
import ResourceVersions from "../../components/pages/resource/ResourceVersions";
import ResourceWiki from "../../components/pages/resource/ResourceWiki";

enum ResourceView {
  HOME = "home",
  VERSIONS = "versions",
  WIKI = "wiki"
}

export default function ResourceId(props: { id: string; view: string }) {
  const [resource, setResource] = useState<Resource>();
  const [versions, setVersions] = useState<Version[]>([]);
  const [author, setAuthor] = useState<User>();
  const [view, setView] = useState<ResourceView>(
    props.view === null ? ResourceView.HOME : (props.view as ResourceView)
  );
  const router = useRouter();

  const BASE_URL = `/resources/${props.id}`;

  const handleViewRouting = () => {
    let viewToUse = props.view === null ? ResourceView.HOME : props.view;
    const view = viewToUse as ResourceView;
    changeView(view);
  };

  useEffect(() => {
    handleViewRouting();
    getAxios()
      .get(`/resources/${props.id}`)
      .then((res) => setResource(res.data.payload.resource));

    getAxios()
      .get(`/directory/versions/resource/${props.id}/1`)
      .then((res) => {
        setVersions(res.data.payload.versions);
      });
  }, []);

  useEffect(() => {
    if (!resource) return;
    getAxios()
      .get(`/directory/user/${resource.owner}`)
      .then((res) => setAuthor(res.data.payload.user));
  }, [resource]);

  const getFirstVersion = () => {
    return versions[versions.length - 1];
  };

  const renderView = () => {
    switch (view) {
      case ResourceView.HOME:
        return <ResourceThread resource={resource} />;
      case ResourceView.VERSIONS:
        return <ResourceVersions resource={resource} />;
      case ResourceView.WIKI:
        return <ResourceWiki/>
      }
  };

  const changeView = (view: ResourceView) => {
    // lowercases just in case. I broke it before using Object.keys :D
    router.push(`${BASE_URL}/${view.toLowerCase()}`, undefined, {
      shallow: true,
    });
    setView(view.toLowerCase() as ResourceView);
  };

  return (
    <Wrapper>
      <div>
        <BackButton onClick={() => router.back()}>
          <ArrowLeft size={"15px"} /> <ButtonText>Return to plugins</ButtonText>
        </BackButton>
      </div>
      <ResourceContentContainer>
        <ResourceBody>
          <ResourceHeader
            resource={resource}
            version={versions[0]}
            onVersionPress={() => {
              changeView(ResourceView.VERSIONS);
            }}
          />
          <ViewController>
            {Object.keys(ResourceView).map((viewEntry: ResourceView) => (
              <ViewEntry
                selected={view === viewEntry.toLowerCase()}
                onClick={() => changeView(viewEntry)}
              >
                {viewEntry}
              </ViewEntry>
            ))}
          </ViewController>
          {renderView()}
          <ResourceRating resource={resource} />
        </ResourceBody>
        <MetadataContainer>
          <PluginInfo
            author={author}
            resource={resource}
            firstVersion={getFirstVersion()}
          />
          <ResourceEdit resource={resource} />
          <DiscordInfo discordServerId={author?.discordServerId} />
        </MetadataContainer>
      </ResourceContentContainer>
    </Wrapper>
  );
}

export async function getServerSideProps({ params }) {
  const slug = params.slug as string[];
  const id = slug[0] ? slug[0] : null;
  const view = slug[1] ? slug[1] : null;
  return { props: { id, view } };
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 2em;
`;

const BackButton = styled(Button)`
  width: auto;
  padding: 12px 20px !important;
  color: black !important;
  background: ${(props: PropsTheme) => props.theme.accentColor} !important;

  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const ButtonText = styled.p`
  margin: 0 0.5em;
`;

const ResourceContentContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  margin: 2em 0;

  @media (max-width: 1000px) {
    flex-direction: column;
  }
`;

const ResourceBody = styled.div`
  display: flex;
  flex-direction: column;
  flex-basis: 70%;
`;

const MetadataContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-basis: 30%;
  margin: 0 1em;
`;

const ViewController = styled.div`
  display: flex;
  flex-direction: row;
  padding: 1em;
  margin-top: 1em;
  border: 1px solid ${(props: PropsTheme) => props.theme.borderColor};
  border-radius: 4px;
`;

const ViewEntry = styled.p`
  padding: 0 0.5em;
  transition: 250ms ease-in-out;
  cursor: pointer;

  ${(props: { selected: boolean }) =>
    props.selected &&
    css`
      color: ${(props: PropsTheme) => props.theme.accentColor};
    `}

  &:hover {
    color: ${(props: PropsTheme) => props.theme.accentColor};
  }
`;
