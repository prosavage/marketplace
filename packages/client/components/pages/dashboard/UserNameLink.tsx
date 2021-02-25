import React from "react";
import {useRecoilValue} from "recoil";
import styled from "styled-components";
import {userState} from "../../../atoms/user";
import AuthorIcon from "../../ui/AuthorIcon";
import getAxios from "../../../util/AxiosInstance";
import {useRouter} from "next/router";
import useToast from "../../../util/hooks/useToast";

export default function UserNameLink() {
    const user = useRecoilValue(userState);

    const router = useRouter();

    const toast = useToast();

    const generateLoginLink = () => {
        toast("Generating stripe login link...")
        getAxios().get("/checkout/link").then(res => {
            router.push(res.data.payload.link.url)
        }).catch(err => toast(err.response.data.error))
    }

    return (
        <Wrapper>
            <AuthorIcon user={user} size={"96px"}/>
            <Content>
                <Name>{user?.username}</Name>
                <ViewAccount onClick={generateLoginLink}>View Stripe Account</ViewAccount>
            </Content>
        </Wrapper>
    );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
`;

const Name = styled.h2`
  font-size: 30px;
  line-height: 18px;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  padding-left: 1em;
  align-items: flex-start;
  justify-content: center;
`;

const ViewAccount = styled.p`
  color: ${(props) => props.theme.accentColor};
  cursor: pointer;
`