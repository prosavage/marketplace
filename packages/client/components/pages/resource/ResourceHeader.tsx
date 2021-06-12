import { loadStripe } from "@stripe/stripe-js";
import FileDownload from "js-file-download";
import { useRouter } from "next/router";
import React from "react";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { userState } from "../../../atoms/user";
import PropsTheme from "../../../styles/theme/PropsTheme";
import { Resource } from "@savagelabs/types";
import { Version } from "@savagelabs/types";
import getAxios from "../../../util/AxiosInstance";
import useToast from "../../../util/hooks/useToast";
import getBaseURL from "../../../util/urlUtil";
import Button from "../../ui/Button";
import ResourceIcon from "../../ui/ResourceIcon";
import { handleAxiosErr } from "../../../util/ErrorParser";

export default function ResourceHeader(props: {
  resource: Resource;
  version: Version | undefined;
  onVersionPress: () => void;
}) {
  const renderButtons = () => {
    let text;
    console.log(user?.purchases?.includes(props.resource?._id), user?.purchases)
    if (
      props.resource?.price === 0 ||
      user?.purchases?.includes(props.resource?._id)
    ) {
      text = "Download";
    } else {
      text = `$${props.resource?.price}`;
    }

    return (
      <>
        <DownloadButton onClick={() => onDownload()}>
          <p>{text}</p>
        </DownloadButton>
        <VersionButton onClick={() => props.onVersionPress()}>
          <p>Versions</p>
        </VersionButton>
      </>
    );
  };

  const toast = useToast();

  const router = useRouter();

  const user = useRecoilValue(userState);

  const onDownload = async () => {
    if (
      props.resource?.price === 0 ||
      user?.purchases?.includes(props.resource?._id)
    ) {
      download();
    } else {
      getAxios()
        .post(`/checkout/session/${props.resource?._id}`, {
          baseurl: getBaseURL(router),
        })
        .then(async (res) => {
          console.log(res.data);
          const stripe = await loadStripe(
            process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
          );
          stripe
            .redirectToCheckout({ sessionId: res.data.payload.session.id })
            .then((res) => console.log(res.error.message));
        })
        .catch((err) => handleAxiosErr(err));
    }
  };

  const download = () => {
    getAxios()
      .get(`directory/versions/download/${props.version?._id}`)
      .then((res) =>
        FileDownload(
          res.data,
          `${props.resource?.name}-${props.version?.version}.jar`
        )
      )
      .catch((err) => {
        toast(err.response.data.error);
      });
  };

  return (
    <>
      <TitleContainer>
        <ResourceIcon resource={props.resource} size={"100px"} />
        <ContentContainer>
          <TextContainer>
            <HeaderContainer>
              <ResourceHeaderText>{props.resource?.name}</ResourceHeaderText>
              <VersionText>v{props.version?.version}</VersionText>
            </HeaderContainer>
            <Description>{props.resource?.description}</Description>
          </TextContainer>
          <DesktopButtonContainer>{renderButtons()}</DesktopButtonContainer>
        </ContentContainer>
      </TitleContainer>
      <MobileButtonContainer>{renderButtons()}</MobileButtonContainer>
    </>
  );
}


const ResourceHeaderText = styled.h1`
  word-wrap: break-word;
  @media(max-width: 400px) {
    font-size: 20px;
    max-width: 250px;
  }
`

const TitleContainer = styled.div`
  display: flex;
  padding: 1em;
  border: 1px solid ${(props: PropsTheme) => props.theme.borderColor};
  border-radius: 4px;
  width: 100%;
  align-items: center;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-grow: 1;
  justify-content: space-between;
  align-items: center;
  margin: 0 1em;
  @media (max-width: 600px) {
    flex-direction: column;
  }
`;
const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 500px;
`;

const Description = styled.p`
  line-height: 14px;
`;

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;


  @media (max-width: 550px) {
    align-items: flex-start;
    flex-direction: column;
  }
`;

const VersionText = styled.p`
  margin: 0 1em;

  @media (max-width: 550px) {
    margin: 0;
  }
`;
const DownloadButton = styled(Button)`
  background: ${(props: PropsTheme) => props.theme.oppositeColor} !important;
  color: ${(props: PropsTheme) => props.theme.accentColor} !important;
  box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.28);
  padding: 10px 10px !important;
  margin: 0.5em 0;

  @media (max-width: 600px) {
    margin: 1em 0;
    width: 100%;
  }
`;

const VersionButton = styled(Button)`
  background: ${(props: PropsTheme) => props.theme.oppositeColor} !important;
  color: ${(props: PropsTheme) => props.theme.color} !important;
  box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.28);
  padding: 10px 10px !important;
  margin: 0.5em 0;

  @media (max-width: 600px) {
    margin: 1em 0;
    width: 100%;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const MobileButtonContainer = styled(ButtonContainer)`
  @media (min-width: 600px) {
    display: none;
  }
`;

const DesktopButtonContainer = styled(ButtonContainer)`
  @media (max-width: 600px) {
    display: none;
  }
`;
