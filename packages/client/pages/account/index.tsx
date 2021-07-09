import { useRouter } from "next/router";
import React, { useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import styled from "styled-components";
import { userState } from "../../atoms/user";
import { AccountViewParent } from "../../components/views/account/account-view-parent/AccountViewParent";
import ProfilePicture from "../../components/views/account/ProfilePicture";
import SecondaryButton from "../../components/ui/Secondarybutton";
import getAxios from "../../util/AxiosInstance";
import { setToken } from "../../util/TokenManager";

export default function Profile() {

    const [user, setUser] = useRecoilState(userState);
    const router = useRouter();

    const logout = () => {
        setToken("");
        setUser(undefined);
        getAxios().post("/auth/logout");
        router.push("/");
      };

    return (
        <AccountViewParent content={() => <>
            <h1>Profile Management</h1>
            <ProfilePicture />
            <div>
            <SecondaryButton onClick={logout}>LOG OUT</SecondaryButton>
            </div>

        </>}
        />
    );
}


