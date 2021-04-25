import Head from "next/head";
import { useRouter } from "next/router";
import NProgress from "nprogress";
import { highlight, languages } from "prismjs";
import React, { useEffect, useState } from "react";
import Editor from "react-simple-code-editor";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { themeState } from "../atoms/theme";
import Button from "../components/ui/Button";
import CategorySelect, { Option } from "../components/ui/CategorySelect";
import Input from "../components/ui/Input";
import DarkTheme from "../styles/theme/DarkTheme";
import LightTheme from "../styles/theme/LightTheme";
import PropsTheme from "../styles/theme/PropsTheme";
import { Resource, ResourceType } from "../types/Resource";
import { Version } from "../types/Version";
import getAxios from "../util/AxiosInstance";
import DefaultThread from "../util/DefaultThread";
import useToast from "../util/hooks/useToast";
import parser from "../util/parser/Parser";
import {
  validateResourceDescription,
  validateResourceThread,
  validateResourceTitle,
  validateResourceVersion,
} from "../util/Validation";

export default function Create() {
  const [theme, setTheme] = useRecoilState(themeState);

  const [submitting, setSubmitting] = useState(false);

  const router = useRouter();

  const [options, setOptions] = useState([]);
  const [category, setCategory] = useState<Option>();

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [description, setDescription] = useState("");
  const [version, setVersion] = useState("");
  const [thread, setThread] = useState(DefaultThread);

  const [file, setFile] = useState<File>();

  const toast = useToast();

  const validateInput = () => {
    if (!validateResourceTitle(title)) {
      toast("invalid title.");
      return false;
    }

    if (!validateResourceDescription(description)) {
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
        name: title,
        description,
        category: category.value,
        thread,
        price,
        version: {
          title,
          description,
          version,
        },
      })
      .then((res) => {
        const resource = res.data.payload.resource;
        const version = res.data.payload.version;
        // now we need to upload the file.
        NProgress.set(0.5);
        sendFile(version, resource);
      })
      .catch((err) => console.log(err, err.response));
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
        toast(err.response.data.error);
      });
  };

  const fetchOptions = () => {
    const newOptions = [];
    [ResourceType.MOD, ResourceType.SOFTWARE, ResourceType.PLUGIN].forEach(
      (category) => {
        getAxios()
          .get(`/directory/categories/${category}`)
          .then((res) => {
            const categories = res.data.payload.categories;
            newOptions.push({
              value: category,
              label: category,
              options: categories.map((entry) => {
                return {
                  value: entry._id,
                  label: entry.name,
                };
              }),
            });
          });
      }
    );
    setOptions(newOptions);
  };

  useEffect(() => {
    fetchOptions();
  }, []);

  return (
    <>
      <Head>
        <title>Create - Marketplace</title>
        <meta name="description" content="Create a Resource" />
      </Head>
      <Wrapper>
        <h1>Create a Resource</h1>
        <InputContainer>
          <label>RESOURCE TITLE</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            type={"text"}
            placeholder={"Enter your resource's title."}
            invalid={!validateResourceTitle(title)}
          />
          <label>PRICE</label>
          <Input
            value={price}
            onChange={(e) => setPrice(Number.parseFloat(e.target.value))}
            type={"number"}
            placeholder={"Enter 0 if free."}
            invalid={false}
          />
        </InputContainer>
        <HContainer>
          <InputContainer>
            <label>DESCRIPTION</label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              type={"text"}
              placeholder={"A short description of what your resource does"}
              invalid={!validateResourceDescription(description)}
            />
          </InputContainer>
        </HContainer>
        <HContainer>
          <InputContainer>
            <label>VERSION</label>
            <Input
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              type={"text"}
              placeholder={"We highly reccomend semantic versioning."}
              invalid={!validateResourceVersion(version)}
            />
          </InputContainer>
        </HContainer>
        <HContainer>
          <InputContainer>
            <label>CATEGORY</label>
            <CategorySelect
              options={options}
              selected={category}
              handleChange={(opt) => setCategory(opt)}
            />
          </InputContainer>
        </HContainer>
        <HContainer>
          <InputContainer>
            <p>Be sure to optimize for dark and light themes.</p>
            <ThreadEditor
              value={thread}
              onValueChange={(code) => setThread(code)}
              highlight={(code) => highlight(code, languages.bbcode, "bbcode")}
              padding={15}
              style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 12,
              }}
            />
            <VSpacedInputContainer>
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  setTheme(theme === LightTheme ? DarkTheme : LightTheme);
                }}
              >
                Toggle Theme: {theme === DarkTheme ? "dark" : "light"}
              </Button>
            </VSpacedInputContainer>
          </InputContainer>
          <VSpacedInputContainer>
            <label>THREAD PREVIEW</label>
            <ThreadContainer>{parser.toReact(thread)}</ThreadContainer>
          </VSpacedInputContainer>
        </HContainer>
        <HContainer>
          <p>Resource File</p>
          <Input
            onChange={(e) => setFile(e.target.files[0])}
            type={"file"}
            accept={"application/java-archive"}
            invalid={!file}
          />
        </HContainer>
        <VSpacedInputContainer>
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
        </VSpacedInputContainer>
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

const ThreadContainer = styled.div`
  padding: 1em;
  border-radius: 4px;
  border: 1px solid ${(props: PropsTheme) => props.theme.borderColor};

  img {
    max-width: 100%;
  }

  * > img {
    max-width: 100%;
  }
`;

const HContainer = styled.div`
  display: flex;
  width: 100%;
  margin: 1em 0;
  justify-content: space-between;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 600px;
  width: 100%;
`;

const PriceContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 25%;
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 70%;
`;

const ThreadEditor = styled(Editor)`
  overflow-y: allow;
  min-height: 150px;
  background: ${(props: PropsTheme) => props.theme.backgroundSecondary};
  color: ${(props: PropsTheme) => props.theme.color};
`;

const VSpacedInputContainer = styled(InputContainer)`
  margin: 1em 0;
`;
