import styled from "styled-components";
import PropsTheme from "../../../styles/theme/PropsTheme";
import { Resource } from "../../../types/Resource";
import React, { useState } from "react";
import Input from "../../ui/Input";
import Button from "../../ui/Button";
import getAxios from "../../../util/AxiosInstance";
import { useRouter } from "next/router";

export default function ResourceIcon({ resource }: { resource: Resource }) {
  const [file, setFile] = useState<File>();

  const [err, setErr] = useState("");

  const router = useRouter();

  const sendIcon = () => {

    const formData = new FormData();
    formData.append("icon", file);

    getAxios()
      .put(`/resources/icon/${resource._id}`, formData, {
        headers: { "content-type": "multipart/form-data" },
      })
      .then((res) => {
        console.log(res.data)
        router.push(`/resources/${resource._id}/`)
      })
      .catch((err) => setErr(err.response.data.error));
  };


  return (
    <Wrapper>
      <ContentContainer>
        {err}
        <label>NEW ICON FILE</label>
        <Input
          onChange={(e) => setFile(e.target.files[0])}
          type={"file"}
          accept={".png"}
          invalid={!file}
        />
        <SubmitContainer>
          <Button onClick={sendIcon}>Submit</Button>
        </SubmitContainer>
      </ContentContainer>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  border: 1px solid ${(props: PropsTheme) => props.theme.borderColor};
  margin: 1em 0;
  padding: 1em;
  border-radius: 4px;

  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 500px;
`;

const SubmitContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin: 1em 0;
`;
