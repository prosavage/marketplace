import React from "react";
import styled from "styled-components";
import { AccountViewParent } from "../../components/pages/account/account-view-parent/AccountViewParent";
import { TeamInvites } from "../../components/pages/account/TeamInvite";

export default function Invites() {
    return (
        <AccountViewParent content={() => <>
            <h1>Invites</h1>
            <TeamInvites />
        </>}
        />
    );
}

