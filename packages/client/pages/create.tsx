import Head from "next/head";
import { useRouter } from "next/router";
import NProgress from "nprogress";
import React, {useEffect, useState} from "react";
import {useRecoilState, useRecoilValue} from "recoil";
import styled from "styled-components";
import { themeState } from "../atoms/theme";
import BBCodeEditor from "../components/pages/create/BBCodeEditor";
import ResourceExtraMetadata from "../components/pages/create/ResourceExtraMetadata";
import ResourceMetadataForm, {
  ResourceMetadata,
} from "../components/pages/create/ResourceMetadata";
import Button from "../components/ui/Button";
import { Option } from "../components/ui/CategorySelect";
import Input from "../components/ui/Input";
import { Resource } from "@savagelabs/types";
import { Version } from "@savagelabs/types";
import getAxios from "../util/AxiosInstance";
import DefaultThread from "../util/DefaultThread";
import useToast from "../util/hooks/useToast";
import {
  validateResourceDescription,
  validateResourceThread,
  validateResourceTitle,
  validateResourceVersion,
} from "../util/Validation";
import {teamState} from "../atoms/team";
import PropsTheme from "../styles/theme/PropsTheme";
import {FlexCol} from "../components/ui/FlexRow";
import {userState} from "../atoms/user";
import { handleAxiosErr } from "../util/ErrorParser";

export default function Create() {
  const [submitting, setSubmitting] = useState(false);

  const router = useRouter();

  const [category, setCategory] = useState<Option>();

  // const [select, setSelect] = useState<string | undefined>();

  const [resourceMetadata, setResourceMetadata] = useState<ResourceMetadata>({
    title: "",
    description: "",
    price: 0,
  });
  const [version, setVersion] = useState("");
  const [thread, setThread] = useState(DefaultThread);

  const [file, setFile] = useState<File>();

  const toast = useToast();

  const teams = useRecoilValue(teamState);

  const user = useRecoilValue(userState);

  useEffect(() => {
    if (!teams || !user) return;
    if (teams.length === 0 || !teams.map(t => t.owner).includes(user._id)) {
      router.push("/team/create")
      toast("Create a team first...")
      return
    }
    // setSelect(teams[0]!!._id)
  }, [])


  const validateInput = () => {
    if (!validateResourceTitle(resourceMetadata.title)) {
      toast("invalid title.");
      return false;
    }

    if (!validateResourceDescription(resourceMetadata.description)) {
      toast("invalid description.");
      return false;
    }

    if (!validateResourceVersion(version)) {
      toast("invalid version");
      return false;
    }

    if (!validateResourceThread(thread)) {
      toast("invalid thread.");
      return false;
    }

    if (!file) {
      toast("invalid or no file uploaded.");
      return false;
    }

    return true;
  };

  const createResource = () => {
    if (submitting) {
      toast("Already creating resource...");
      return;
    }
    if (!validateInput()) return;
    setSubmitting(true);
    NProgress.start();
    getAxios()
      .put("/resources", {
        name: resourceMetadata.title,
        description: resourceMetadata.description,
        category: category.value,
        thread,
        price: resourceMetadata.price,
        version: {
          title: resourceMetadata.title,
          description: resourceMetadata.description,
          version: version,
        },
      })
      .then((res) => {
        const resource = res.data.payload.resource;
        const version = res.data.payload.version;
        // now we need to upload the file.
        NProgress.set(0.5);
        sendFile(version, resource);
      })
      .catch((err) => {
        handleAxiosErr(err)
        NProgress.done();
      });
  };

  const sendFile = (version: Version, resource: Resource) => {
    const formData = new FormData();
    formData.append("resource", file);
    NProgress.inc();
    getAxios()
      .put(`/version/${version._id}`, formData, {
        headers: { "content-type": "multipart/form-data" },
      })
      .then((res) => {
        NProgress.done();
        // Now that we are done we can redirect!
        router.push(`/resources/${resource._id}`);
      })
      .catch((err) => {
        NProgress.done();
        handleAxiosErr(err)
      });
  };

  return (
    <>
      <Head>
        <title>Create - Marketplace</title>
        <meta name="description" content="Create a Resource" />
      </Head>
      <Wrapper>
        <h1>Create a Resource</h1>
        <MetadataWrapper>
          <ResourceMetadataForm
            metadata={resourceMetadata}
            onMetaChange={(meta) => setResourceMetadata(meta)}
          />
          <ResourceExtraMetadata
            version={version}
            category={category}
            onCatChange={(cat) => setCategory(cat)}
            onVerChange={(ver) => setVersion(ver)}
          />
        </MetadataWrapper>
        <PaddedHContainer>
          <InputContainer>
            <p>Resource File</p>
            <Input
              onChange={(e) => setFile(e.target.files[0])}
              type={"file"}
              accept={"application/java-archive"}
              invalid={!file}
            />
          </InputContainer>
        </PaddedHContainer>
        {/*<PaddedHContainer>*/}
        {/* <FlexCol>*/}
        {/*   <label>Resource Team</label>*/}
        {/*   <Select*/}
        {/*       name={"resource"}*/}
        {/*       value={select}*/}
        {/*       onChange={(e) => setSelect(e.target.value)}*/}
        {/*   >*/}
        {/*     {teams?.map((team) => (*/}
        {/*         <option key={team._id} value={team._id}>*/}
        {/*           {team.name}*/}
        {/*         </option>*/}
        {/*     ))}*/}
        {/*   </Select>*/}
        {/* </FlexCol>*/}

        {/*</PaddedHContainer>*/}
        <PaddedHContainer>
          <Button
            style={{ margin: "1em 0" }}
            type={"submit"}
            onClick={(e) => {
              e.preventDefault();
              createResource();
            }}
          >
            CREATE RESOURCE
          </Button>
        </PaddedHContainer>
        <HContainer>
          <BBCodeEditor
            content={thread}
            onChange={(newThread) => setThread(newThread)}
          />
        </HContainer>
      </Wrapper>
    </>
  );
}

const Wrapper = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 1em 0;
`;

const Select = styled.select`
  padding: 10px 0;
  margin: .5em 0;
  border-radius: 5px;
  border-color: ${(props: PropsTheme) => props.theme.accentColor};
  background: transparent;
  color: ${(props: PropsTheme) => props.theme.color};

  option {
    color: black;
  }
`;

const HContainer = styled.div`
  display: flex;
  width: 100%;
  margin: 1em 0;
  justify-content: space-between;
`;

const PaddedHContainer = styled(HContainer)`
  margin: 0 0.5em;
`;

const MetadataWrapper = styled.div`
  display: flex;
  flex-direction: row;

  @media (max-width: 700px) {
    flex-direction: column;
  }
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 350px;
  width: 100%;
  margin: 0.5em 0;
`;

const VSpacedInputContainer = styled(InputContainer)`
  margin: 1em 0;
`;
