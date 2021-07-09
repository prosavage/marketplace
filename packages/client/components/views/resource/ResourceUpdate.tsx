import { useRouter } from "next/router";
import { highlight, languages } from "prismjs";
import React, { useState } from "react";
import Editor from "react-simple-code-editor";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { userState } from "../../../atoms/user";
import PropsTheme from "../../../styles/theme/PropsTheme";
import { Resource } from "@savagelabs/types";
import { Version } from "@savagelabs/types";
import getAxios from "../../../util/AxiosInstance";
import useToast from "../../../util/hooks/useToast";
import {
  validateVersionDescription,
  validateVersionTitle,
  validateVersionVersionString,
} from "../../../util/Validation";
import Button from "../../ui/Button";
import Input from "../../ui/Input";
import ResourceVersionEntry from "./ResourceVersionEntry";
import { handleAxiosErr } from "../../../util/ErrorParser";
import Nprogress from "nprogress";

export default function ResourceUpdate({
  resource,
  onSubmit,
}: {
  resource: Resource;
  onSubmit: () => void;
}) {
  const [title, setTitle] = useState("");
  const [version, setVersion] = useState("");
  const [file, setFile] = useState<File>();
  const [description, setDescription] = useState(DEFAULT_DESCRIPTION);
  const [isDev, setDev] = useState(false);

  const [err, setErr] = useState("");

  const user = useRecoilValue(userState);

  const toast = useToast();

  const router = useRouter();

  const postVersion = () => {
    if (!validateVersionVersionString(version)) {
      setErr("invalid version string, 2-30 chars.");
      return;
    }
    if (!validateVersionTitle(title)) {
      setErr("invalid version title, 2-30 chars.");
      return;
    }
    if (!validateVersionDescription(description)) {
      setErr("invalid version description.");
      return;
    }

    if (!file) {
      setErr("upload a file first.");
      return;
    }

    Nprogress.start();

    getAxios()
      .put("/version", {
        title,
        version,
        description,
        resource: resource?._id,
        isDev,
      })
      .then((res) => {
        sendFile(res.data.payload.version);
        Nprogress.done();
      })
      .catch((err) => {
        handleAxiosErr(err);
        Nprogress.done();
      });
  };

  const sendFile = (version: Version) => {
    console.log(version);
    console.log("sending file...");
    const formData = new FormData();
    formData.append("resource", file);
    getAxios()
      .put(`/version/${version._id}`, formData, {
        headers: { "content-type": "multipart/form-data" },
      })
      .then((res) => {
        onSubmit();
        toast("Successfully updated!");
        router.push(`/resources/${resource._id}/versions`);
      })
      .catch((err) => handleAxiosErr(err));
  };

  return (
    <Wrapper>
      {err}
      <InputWrapper>
        <label>UPDATE TITLE</label>
        <Input
          placeholder={"Update Title"}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          invalid={!validateVersionTitle(title)}
        />
      </InputWrapper>
      <InputWrapper>
        <label>VERSION</label>
        <Input
          placeholder={"Version string e.g. 1.4"}
          value={version}
          onChange={(e) => setVersion(e.target.value)}
          invalid={!validateVersionVersionString(version)}
        />
      </InputWrapper>
      <InputWrapper>
        <label>DESCRIPTION</label>
        <ThreadEditor
          value={description}
          onValueChange={(code) => setDescription(code)}
          highlight={(code) => highlight(code, languages.bbcode, "bbcode")}
          padding={15}
          style={{
            fontFamily: '"Fira code", "Fira Mono", monospace',
            fontSize: 12,
          }}
        />
      </InputWrapper>
      <InputWrapper>
        <Input
          onChange={(e) => {
            setFile(e.target.files[0]);
            console.log(e.target.files[0]);
          }}
          type={"file"}
          accept={".jar,.zip"}
          invalid={!file}
        />
      </InputWrapper>
      <InputWrapper>
        <input
          onChange={() => {
            setDev(!isDev);
            console.log(isDev);
          }}
          defaultChecked={isDev}
          type="checkbox"
          id="test1"
        />
        <label htmlFor="test1">Mark as dev build</label>
      </InputWrapper>
      <InputWrapper>
        <Button onClick={() => postVersion()}>UPDATE</Button>
      </InputWrapper>
      <ResourceVersionEntry
        resource={resource}
        onVersionSelect={(v) => {}}
        version={{
          _id: "",
          title,
          timestamp: new Date(),
          version,
          description,
          resource: resource?._id,
          author: user?._id,
          isDev: isDev,
          fileName: file?.name,
        }}
      />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1em;
  border: 1px solid ${(props: PropsTheme) => props.theme.borderColor};
  border-radius: 4px;
  margin: 1em 0;
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 1em 0;
  max-width: 500px;
  width: 100%;
`;

const ThreadEditor = styled(Editor)`
  width: 100%;
  min-height: 150px;
  background: ${(props: PropsTheme) => props.theme.backgroundSecondary};
  color: ${(props: PropsTheme) => props.theme.color};
`;

const DEFAULT_DESCRIPTION = `[center]Example Description Title[/center]
[list]
[*] New feature 1
[*] New feature 2
[/list]`;
