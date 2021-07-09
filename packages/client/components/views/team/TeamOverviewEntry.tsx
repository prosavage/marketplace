import { Team } from "@savagelabs/types";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import {TeamInviteWithUser, TeamWithUsers} from "@savagelabs/types";
import { themeState } from "../../../atoms/theme";
import PropsTheme from "../../../styles/theme/PropsTheme";
import getAxios from "../../../util/AxiosInstance";
import { handleAxiosErr } from "../../../util/ErrorParser";
import AuthorIcon from "../../ui/AuthorIcon";
import Button from "../../ui/Button";
import { FlexCol, FlexRow } from "../../ui/FlexRow";
import { TeamOverviewManager } from "./TeamOverviewManager";
import useToast from "../../../util/hooks/useToast";
import { userState } from "../../../atoms/user";

interface TeamOverviewEntryProps {
    team: Team
}

export const TeamOverviewEntry: React.FC<TeamOverviewEntryProps> = ({ team }) => {

    const theme = useRecoilValue(themeState)
    const router = useRouter();

    const [managed, setManaged] = useState(false)

    const [teamWithMembers, setTeamWithMembers] = useState<TeamWithUsers>()


    const [invites, setInvites] = useState<TeamInviteWithUser[]>([]);

    useEffect(() => {
        getAxios().get("/directory/invite/by-team/" + team._id).then(res => {
            setInvites(res.data.payload.invites)
        }).catch(err => {
            handleAxiosErr(err)
        })

        getAxios().get("/directory/team/with-members/" + team._id).then(res => {
            setTeamWithMembers(res.data.payload.team)
        }).catch(err => {
            handleAxiosErr(err)
        })
    }, [])

    const userIdToIcon = (member: string, invite: boolean) => {
        return <AuthorIcon key={member}
            style={{
                border: `1px solid ${theme.borderColor}`,
                margin: "0 .5em",
                marginLeft: "-20px",
                cursor: "pointer",
                filter: invite ? "grayscale(100%)" : null
            }}
            overrideUserId={member}
            size={"35px"}
            onClick={() => router.push(`/users/${member}`)}
        />
    }

    const toast = useToast();

    const me = useRecoilValue(userState);

    const toggleManaged = () => {
        if (team.owner !== me._id) {
            toast("You cannot manage a team you do not own.")
            return
        }
        setManaged(!managed)
    }

    return (
        <Wrapper>
            <TopRow>
                <h2>{team.name}</h2>
                <TopSubRow>
                <IconsContainer>
                    {team.members.concat(team.owner).reverse().map(member =>
                        userIdToIcon(member, false)
                    )}
                    {invites.map(invite => userIdToIcon(invite.invitee._id, true))}
                </IconsContainer>
                <Button onClick={toggleManaged}>
                    MANAGE
                </Button>
                </TopSubRow>
            </TopRow>
            {managed ? <TeamOverviewManager initTeam={teamWithMembers} invites={invites} /> : null}
        </Wrapper>);
}


const Wrapper = styled(FlexCol)`
  width: 100%;
  border: 1px solid ${(props: PropsTheme) => props.theme.borderColor};
  border-radius: 5px;
  margin-top: 1em;
`

const TopRow = styled(FlexRow)`
  justify-content: space-between;
  padding: 1em;
  width: 100%;
`

const TopSubRow = styled(FlexRow)`
    justify-content: space-between;
`

const IconsContainer = styled(FlexRow)`
  align-items: center;
  justify-content: center;
`

