import React, { useState } from "react";
import { useEffect } from "react";
import styled from "styled-components";
import { Resource } from "../../../../types";
import { Webhook } from "@savagelabs/types";
import PropsTheme from "../../../styles/theme/PropsTheme";
import getAxios from "../../../util/AxiosInstance";
import { handleAxiosErr, IsErrorMessage } from "../../../util/ErrorParser";
import useToast from "../../../util/hooks/useToast";
import Button from "../../ui/Button";
import { FlexCol, FlexRow } from "../../ui/FlexRow";
import Input from "../../ui/Input";

interface ResourceWebhookProps {
  resource: Resource;
}

export const ResourceWebhook: React.FC<ResourceWebhookProps> = ({ resource }) => {
  const [webhook, setWebhook] = useState<Webhook | undefined>();

  const [url, setURL] = useState("");

  const toast = useToast();

  useEffect(() => {
    if (!resource) return;
    getAxios()
      .get("/webhooks/" + resource?._id)
      .then((res) => {
        const wh = res.data.payload.webhook;
        setWebhook(wh);
        if (wh) {
          setURL(wh.url);
        }
        console.log(res.data);
      })
      .catch((err) => {
        // dont really care here, since it just needs to pull my current webhook.
        if (IsErrorMessage(err, "webhook not found")) {
          console.log("no webhook was found.")
          return;
        }

        handleAxiosErr(err)
      });
  }, [resource]);

  const didWebhookURLChange = () => {
    if (webhook === undefined && url !== "") return true;
    return webhook?.url !== url;
  };

  const deleteHook = (createNew: boolean) => {
    if (!resource) {
      toast("Cannot create yet...");
      return;
    }

    if (createNew && !webhook) {
      createHook();
      return;
    }

    getAxios()
      .delete("/webhooks/" + webhook._id, {
        data: {
          resource: resource?._id,
        },
      })
      .then((res) => {
        toast("old webhook was deleted");
        // I know this is ghetto as fuck.
        if (createNew) {
          createHook();
        } else {
          setWebhook(undefined)
        }
      })
      .catch((err) => handleAxiosErr(err));
  };

  const createHook = () => {
    if (!resource) {
      toast("Cannot create yet...");
      return;
    }
    getAxios()
      .put("/webhooks", {
        url: url,
        resource: resource._id,
      })
      .then((res) => {
        toast("webhook was created!");
        setWebhook(res.data.payload.webhook);
      })
      .catch((err) => handleAxiosErr(err));
  };


  const sendTest = () => {
    getAxios().get("/webhooks/" + resource?._id + "/test")
        .then(res => {toast("test webhook was sent!")})
        .catch(err => handleAxiosErr(err))
  }

  return (
    <Wrapper>
      <h2>Webhook Management</h2>
      <p>You can utilize webhooks to show update notifications automatically on discord.</p>
      <WrapperContent>
        <label>Webhook URL</label>
        <WebhookInput
          placeholder={"https://discord.com/some-webhook"}
          value={url}
          onChange={(e) => setURL(e.target.value)}
        />
        <FlexRow>
          <WHButton disabled={!didWebhookURLChange()} onClick={() => deleteHook(true)}>
            Submit
          </WHButton>
          <WHButton disabled={webhook === undefined} onClick={() => sendTest()}>Send Test</WHButton>
          <WHButton disabled={webhook === undefined} onClick={() => deleteHook(false)}>
            Reset / Delete
          </WHButton>
        </FlexRow>
      </WrapperContent>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1em;
  border: 1px solid ${(props: PropsTheme) => props.theme.borderColor};
  border-radius: 4px;
  margin: 1em 0;
`;

const WrapperContent = styled(FlexCol)`
  align-items: flex-start;
  width: 100%;
`;

const WebhookInput = styled(Input)`
  width: 100%;
`;

const WHButton = styled(Button)`
  margin: 1em 1em 1em 0em;
`;
