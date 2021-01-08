import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ArrowLeft } from "react-feather";
import styled from "styled-components";
import ResourceHeader from "../../components/pages/resource/ResourceHeader";
import Button from "../../components/ui/Button";
import ResourceIcon from "../../components/ui/ResourceIcon";
import PropsTheme from "../../styles/theme/PropsTheme";
import { Resource } from "../../types/Resource";
import { Version } from "../../types/Version";
import getAxios from "../../util/AxiosInstance";

export default function ResourceId(props: { id: string }) {
  const [resource, setResource] = useState<Resource>();
  const [versions, setVersions] = useState<Version[]>([]);
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
        </ResourceBody>
        <MetadataContainer>
          <PluginInfo>
            <p>yeah</p>
          </PluginInfo>
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
`;

const ResourceBody = styled.div`
  display: flex;
  flex-direction: column;
  flex-basis: 75%;
`;

const MetadataContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-basis: 25%;
  margin: 0 1em;
`;

const PluginInfo = styled.div`
  border: 1px solid ${(props: PropsTheme) => props.theme.borderColor};
  border-radius: 4px;
`;
