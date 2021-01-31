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
import ResourceRating from "../../components/pages/resource/ResourceRating";
import ResourceVersions from "../../components/pages/resource/ResourceVersions";
import ResourceWiki from "../../components/pages/resource/ResourceWiki";
import { useRecoilValue } from "recoil";
import { userState } from "../../atoms/user";
import ResourceVersionEntry from "../../components/pages/resource/ResourceVersionEntry";
import ResourceUpdate from "../../components/pages/resource/ResourceUpdate";
import ResourceEdit from "../../components/pages/resource/ResourceEdit";

enum ResourceView {
  HOME = "home",
  VERSIONS = "versions",
  WIKI = "wiki",
  VERSION = "version",
  UPDATE = "update",
  ICON = "icon",
  EDIT = "edit",
}

export default function ResourceId(props: {
  id: string;
  view: string;
  entry: string;
}) {
  // For general resource info.
  const [resource, setResource] = useState<Resource>();
  // For versions page and browser.
  const [versions, setVersions] = useState<Version[]>([]);
  // For specific version rendering, when we just want to show one version's info.
  const [specificVersion, setSpecificVersion] = useState<Version>();
  // Author info for sidebar, and ownership purposes.
  const [author, setAuthor] = useState<User>();
  // Actual viewing system for changing components out based on URL state.
  const [view, setView] = useState<ResourceView>(
    props.view === null ? ResourceView.HOME : (props.view as ResourceView)
  );

  const router = useRouter();

  const user = useRecoilValue(userState);

  const viewerOwnsResource = () => {
    // both can be undefined if loading, and return true, causing a flicker.
    if (!resource || !user) return false;
    return resource?.owner === user?._id;
  };

  const isOwnerView = (view: ResourceView) => {
    return [ResourceView.UPDATE, ResourceView.ICON, ResourceView.EDIT].includes(
      view.toLowerCase() as ResourceView
    );
  };

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
    if (view === ResourceView.VERSION) {
      if (props.entry === undefined) {
        // no version entry given.
        // we need to redirect to versions.
        router.push(`${BASE_URL}/versions`);
        return;
      }
      getAxios()
        .get(`/version/${props.entry}`)
        .then((res) => setSpecificVersion(res.data.payload))
        .catch((err) => console.log(err.response.data));
    }
  }, [props.entry]);

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
        return (
          <ResourceVersions
            onVersionSelect={(v) => {
              console.log("ver change");
              setView(ResourceView.VERSION);
              router.push(
                `/resources/${resource._id}/version/${v._id}`,
                undefined,
                { shallow: true }
              );
              setSpecificVersion(v);
            }}
            resource={resource}
          />
        );
      case ResourceView.WIKI:
        return <ResourceWiki />;
      case ResourceView.VERSION:
        return (
          <ResourceVersionEntry
            resource={resource}
            // dont need to do anything on version select since its like already done.
            onVersionSelect={(v) => {}}
            version={specificVersion}
          />
        );
      case ResourceView.UPDATE:
        return (
          <ResourceUpdate
            resource={resource}
            onSubmit={() => changeView(ResourceView.VERSIONS)}
          />
        );

      case ResourceView.EDIT:
        return <ResourceEdit resource={resource} />;
    }
  };

  const changeView = (view: ResourceView) => {
    // lowercases just in case. I broke it before using Object.keys :D
    router.push(`${BASE_URL}/${view.toLowerCase()}`, undefined, {
      shallow: true,
    });
    setView(view.toLowerCase() as ResourceView);
  };

  const renderViewController = () => {
    return (
      <ViewController>
        {Object.keys(ResourceView)
          // filter version view since its for specified version only.
          .filter(
            (entry) =>
              entry.toUpperCase() !== ResourceView.VERSION.toUpperCase()
          )
          .filter(
            (e) =>
              !(
                !viewerOwnsResource() &&
                isOwnerView(e.toUpperCase() as ResourceView)
              )
          )
          .map((viewEntry: ResourceView) => (
            <ViewEntry
              key={viewEntry}
              selected={view === viewEntry.toLowerCase()}
              onClick={() => changeView(viewEntry)}
            >
              {viewEntry}
            </ViewEntry>
          ))}
      </ViewController>
    );
  };

  return (
    <Wrapper>
      <div>
        <BackButton onClick={() => router.back()}>
          <BackArrow size={"15px"} /> <ButtonText>Return to plugins</ButtonText>
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
          {renderViewController()}
          {renderView()}
          <ResourceRating resource={resource} />
        </ResourceBody>
        <MetadataContainer>
          <PluginInfo
            author={author}
            resource={resource}
            firstVersion={getFirstVersion()}
          />
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
  const entry = slug[2] ? slug[2] : null;
  return { props: { id, view, entry } };
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

const BackArrow = styled(ArrowLeft)`
  color: ${(props: PropsTheme) => props.theme.oppositeColor};
`;

const ButtonText = styled.p`
  margin: 0 0.5em;
  color: ${(props: PropsTheme) => props.theme.oppositeColor};
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
      color: ${(props: PropsTheme) => props.theme.secondaryAccentColor};
    `}

  &:hover {
    color: ${(props: PropsTheme) => props.theme.secondaryAccentColor};
  }
`;
