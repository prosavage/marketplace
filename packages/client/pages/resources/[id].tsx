import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ArrowLeft, TrendingUp } from "react-feather";
import styled from "styled-components";
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

export default function ResourceId(props: { id: string }) {
  const [resource, setResource] = useState<Resource>();
  const [versions, setVersions] = useState<Version[]>([]);
  const [author, setAuthor] = useState<User>();
  const router = useRouter();

  useEffect(() => {
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

  return (
    <Wrapper>
      <div> 
        <BackButton onClick={() => router.back()}>
          <ArrowLeft size={"15px"} /> <ButtonText>Return to plugins</ButtonText>
        </BackButton>
      </div>
      <ResourceContentContainer>
        <ResourceBody>
          <ResourceHeader resource={resource} version={versions[0]} />
          <ResourceThread resource={resource}/>
          <ResourceRating/>
        </ResourceBody>
        <MetadataContainer>
          <PluginInfo
            author={author}
            resource={resource}
            firstVersion={getFirstVersion()}
          />
          <ResourceEdit
          resource={resource}
          />
          <DiscordInfo discordServerId={author?.discordServerId}/>
        </MetadataContainer>
      </ResourceContentContainer>
    </Wrapper>
  );
}

export async function getServerSideProps({ params }) {
  const id = params.id as string;

  return { props: { id } };
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

  @media(max-width: 1000px) {
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
