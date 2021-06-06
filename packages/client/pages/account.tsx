import Head from "next/head";
import { useRouter } from "next/router";
import NProgress from "nprogress";
import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { userState } from "../atoms/user";
import DiscordIntegration from "../components/pages/account/DiscordIntegration";
import ProfilePicture from "../components/pages/account/ProfilePicture";
import { TeamInvites } from "../components/pages/account/TeamInvite";
import Button from "../components/ui/Button";
import getAxios from "../util/AxiosInstance";
import useToast from "../util/hooks/useToast";
import { setToken } from "../util/TokenManager";
import getBaseURL from "../util/urlUtil";
import SecondaryButton from "./../components/ui/Secondarybutton";

export default function Account(props) {
  const [user, setUser] = useRecoilState(userState);

  const [account, setAccount] = useState<any>();

  const router = useRouter();

  const toast = useToast();

  const connectStripe = () => {
    NProgress.start();
    getAxios()
      .post(`/checkout/stripe/setup/create`, { baseurl: getBaseURL(router) })
      .then((res) => {
        NProgress.done();
        router.push(res.data.payload.accountLink.url);
      })
      .catch((err) => {
        NProgress.done();
        console.log(err.response.data);
        toast("Something went wrong...");
      });
  };

  const logout = () => {
    setToken("");
    setUser(undefined);
    getAxios().post("/auth/logout");
    router.push("/");
  };

  useEffect(() => {
    getAxios()
      .get("/checkout/stripe/setup/verify")
      .then((res) => {
        if (res.data.payload.account!!.charges_enabled) {
          setAccount("Payments are enabled.");
        } else {
          setAccount("Payments DISABLED, reconnect stripe.");
        }
      })
      .catch((err) => {
        setAccount(err.response.data.error);
      });
  }, [user]);

  const getStripeIntegration = () => {
    if (account === undefined) {
      return <p>Loading stripe account info...</p>;
    } else {
      return (
        <>
          <p>Stripe Integration:</p>
          <p>{account}</p>
        </>
      );
    }
  };

  return (
    <>
      <Head>
        <title>User - Marketplace</title>
        <meta name="description" content="Account Page" />
      </Head>
      <Wrapper>
        <VSpace>
          <h1>Account</h1>
          <hr />
        </VSpace>
        <VSpace>
          <Row>
            <ProfilePicture />
          </Row>
          <Row>
            <SecondaryButton onClick={logout}>LOG OUT</SecondaryButton>
          </Row>
        </VSpace>
        <VSpace>
          <h1>Team Invites</h1>
          <hr />
          <TeamInvites />
        </VSpace>
        <VSpace>
          <h1>Payments</h1>
          <hr />
        </VSpace>
        <VSpace>
          <Row>
            Stripe Integration:{" "}
            <Button onClick={connectStripe}>Connect Stripe</Button>
          </Row>
          <Row>{getStripeIntegration()}</Row>
        </VSpace>
        <VSpace>
          <h1>Integration</h1>
          <hr />
          <DiscordIntegration />
        </VSpace>
      </Wrapper>
    </>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  max-width: 500px;
`;

const VSpace = styled.div`
  display: flex;
  flex-direction: column;
  margin: 1em 0;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0.5em 0;
`;
