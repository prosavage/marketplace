import React from "react";
import styled from "styled-components";
import { AccountViewParent } from "../../components/views/account/account-view-parent/AccountViewParent";
import { TeamInvites } from "../../components/views/account/TeamInvite";

export default function Invites() {
    return (
        <AccountViewParent content={() => <>
            <h1>Invites</h1>
            <TeamInvites />
        </>}
        />
    );
}

