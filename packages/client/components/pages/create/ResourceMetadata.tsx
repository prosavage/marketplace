import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import PropsTheme from "../../../styles/theme/PropsTheme";
import getAxios from "../../../util/AxiosInstance";
import { validateResourceDescription, validateResourceTitle } from "../../../util/Validation";
import Input from "../../ui/Input";
import { LinkSpan } from "../../ui/LinkSpan";
export interface ResourceMetadata {
  title: string;
  price: number;
  description: string;
}

enum STRIPE_STATUS {
  LOADING,
  ALLOWED,
  DENIED,
  ERROR,
  NOT_FOUND,
}

export default function ResourceMetadataForm(props: {
  metadata: ResourceMetadata;
  onMetaChange: (metadata: ResourceMetadata) => void;
}) {
  const [stripe, setStripe] = useState(STRIPE_STATUS.LOADING);

  const [metadata, setMetadata] = useState<ResourceMetadata>(props.metadata);

  const router = useRouter();

  useEffect(() => {
    checkStripe();
  }, []);

  const checkStripe = () => {
    getAxios()
      .get("/checkout/stripe/setup/verify")
      .then((res) => {
        if (res.data.payload.account!!.charges_enabled) {
          setStripe(STRIPE_STATUS.ALLOWED);
        } else {
          setStripe(STRIPE_STATUS.DENIED);
        }
      })
      .catch((err) => {
        if (err.response?.data?.error) {
          if (err.response.data.error === "seller not found.") {
            setStripe(STRIPE_STATUS.NOT_FOUND);
            return;
          }
        }
        setStripe(STRIPE_STATUS.ERROR);
        console.log(err.response.data);
      });
  };

  const renderStripeInfo = () => {
    switch (stripe) {
      case STRIPE_STATUS.LOADING:
        return <p>Checking stripe status...</p>;
      case STRIPE_STATUS.ALLOWED:
        return <p>Stripe is enabled, you can post premium resources.</p>;
      case STRIPE_STATUS.DENIED:
        return (
          <p>
            Stripe is not setup or disabled, go to{" "}
            <AccountLinkText onClick={() => router.push("/account")}>
              account settings
            </AccountLinkText>{" "}
            to enable.
          </p>
        );
      case STRIPE_STATUS.NOT_FOUND:
        return (
          <p>
            Stripe seller not found, you need to set it up to enable premium resources.{" "}
            <LinkSpan href={"/account"}>Stripe Setup.</LinkSpan>
          </p>
        );
      case STRIPE_STATUS.ERROR:
        return <p>Something went wrong checking stripe status, please report.</p>;
    }
  };

  const disableInput = () => {
    return stripe !== STRIPE_STATUS.ALLOWED;
  };

  return (
    <Wrapper>
      <InputContainer>
        <label>RESOURCE TITLE</label>
        <Input
          invalid={!validateResourceTitle(metadata.title)}
          placeholder={"Example Plugin"}
          value={metadata.title}
          onChange={(e) => {
            setMetadata({
              ...metadata,
              title: e.target.value,
            });
            props.onMetaChange(metadata);
          }}
        />
      </InputContainer>
      <InputContainer>
        <label>RESOURCE DESCRIPTION</label>
        <Input
          invalid={!validateResourceDescription(metadata.description)}
          placeholder={"A cool plugin that does something."}
          value={metadata.description}
          onChange={(e) => {
            setMetadata({
              ...metadata,
              description: e.target.value,
            });
            props.onMetaChange(metadata);
          }}
        />
      </InputContainer>
      <InputContainer>
        <label>PRICING</label>
        {renderStripeInfo()}
        <Input
          invalid={false}
          placeholder={"0"}
          type={"number"}
          disabled={disableInput()}
          value={metadata.price}
          onChange={(e) => {
            setMetadata({
              ...metadata,
              price: Number.parseFloat(e.target.value),
            });
            props.onMetaChange(metadata);
          }}
        />
      </InputContainer>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 0.5em;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 350px;
  margin: 0.5em 0;
`;

const AccountLinkText = styled.span`
  cursor: pointer;
  color: ${(props: PropsTheme) => props.theme.accentColor};
`;
