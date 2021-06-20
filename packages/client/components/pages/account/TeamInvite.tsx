import { TeamInviteWithTeam } from "@savagelabs/types";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import getAxios from "../../../util/AxiosInstance";
import { handleAxiosErr } from "../../../util/ErrorParser";
import Button from "../../ui/Button";
import { FlexCol, FlexRow } from "../../ui/FlexRow";
interface TeamInviteProps {

}

export const TeamInvites: React.FC<TeamInviteProps> = ({ }) => {

    const [myInvites, setMyInvites] = useState<TeamInviteWithTeam[]>([])

    useEffect(() => {
        getAxios()
            .get("/directory/invite/me")
            .then(res => {
                console.log(res.data.payload)
                setMyInvites(res.data.payload.invites)
            })
            .catch(err => handleAxiosErr(err))
    }, [])

    const handleInvite = (invite: TeamInviteWithTeam, action: "accept" | "deny") => {
        getAxios().get(`/invite/${action}/` + invite._id)
        .then(res => {
            setMyInvites([...myInvites.filter(myInv => myInv._id !== invite._id)])
        }).catch(err => handleAxiosErr(err))
    }

    return (
        <Wrapper>
            {myInvites.map(inv => <InviteWrapper key={inv._id}>
                <p>{inv.team.name}</p>
                <FlexRow>
                    <Button style={{ marginRight: "1em" }} onClick={() => handleInvite(inv, "accept")}  >ACCEPT</Button>
                    <Button onClick={() => handleInvite(inv, "deny")}>DENY</Button>
                </FlexRow>
            </InviteWrapper>)}
        </Wrapper>
    );
}

const Wrapper = styled(FlexCol)`
    margin-top: 1em;
`

const InviteWrapper = styled(FlexRow)`
    justify-content: space-between;
`