import { useRouter } from "next/router";
import React from "react";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { userState } from "../atoms/user";
import getAxios from "../util/AxiosInstance";
import { setToken } from "../util/TokenManager";
import SecondaryButton from "./../components/ui/Secondarybutton";

export default function Account(props) {
  const [user, setUser] = useRecoilState(userState);

  const router = useRouter();

  return (
    <Wrapper>
      <p>Temporary Account Page.</p>
      <VSpace>
        <SecondaryButton
          onClick={() => {
            setToken("");
            setUser(undefined);
            getAxios().post("/auth/logout");
            router.push("/");
          }}
        >
          LOG OUT
        </SecondaryButton>
      </VSpace>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const VSpace = styled.div`
  display: flex;
  flex-direction: column;
  margin: 1em 0;
`;
