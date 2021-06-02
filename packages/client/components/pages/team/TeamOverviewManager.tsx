import {FUser, Team, TeamWithUsers} from "@savagelabs/types";
import React, {useEffect, useState} from "react";
import styled from "styled-components";
import {TeamInviteWithUser} from "@savagelabs/types";
import getAxios from "../../../util/AxiosInstance";
import {handleAxiosErr} from "../../../util/ErrorParser";
import AuthorIcon from "../../ui/AuthorIcon";
import {FlexCol, FlexRow} from "../../ui/FlexRow";
import Input from "../../ui/Input";
import TeamIcon from "../../ui/TeamIcon";
import Button from "./../../ui/Button";
import nprogress from "nprogress"
import {useRecoilValue} from "recoil";
import {userState} from "../../../atoms/user";
import useToast from "../../../util/hooks/useToast";
interface TeamOverviewManagerProps {
    team?: TeamWithUsers
    invites: TeamInviteWithUser[]
}

export const TeamOverviewManager: React.FC<TeamOverviewManagerProps> = ({team, invites}) => {

    const [invited, setInvited] = useState<TeamInviteWithUser[]>(invites)

    const [inviteEmail, setInviteEmail] = useState("");


    useEffect(() => {
        setInvited(invites)
    }, [invites])

    const me = useRecoilValue(userState);

    const toast = useToast()

    const inviteUser = (e) => {
        e.preventDefault();

        nprogress.start();
        getAxios()
            .get("/directory/user/by-email/" + inviteEmail)
            .then((res) => {
                const user: FUser = res.data.payload.user;


                if (me._id === user._id) {
                    toast("You cannot invite yourself.")
                } else if (!invited.map((user) => user._id).includes(user._id)) {
                    setInvited([res.data.payload.user, ...invited]);
                } else {
                    toast("This user is already invited.");
                }

                setInviteEmail("");
                nprogress.done();
            })
            .catch((err) => {
                toast(err.response.data.error);
                nprogress.done();
            });
    };

    return (<Wrapper>
        <GeneralControls>
            <label>Team Name</label>
            <TeamNameInput value={team.name}/>
            <IconUpdateContainer>
                <IconColumn>
                    <label>Update Team Icon</label>
                    <Input type={"file"}/>
                </IconColumn>
                <TeamIcon size={"100px"} team={team}/>
            </IconUpdateContainer>
        </GeneralControls>
        <InviteControls>
            <label>Invites</label>
            <form>
                <InviteRow>
                    <InviteInput value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)}
                                 placeholder={"User's Email"}/>
                    <Button type={"submit"} onSubmit={inviteUser}>INVITE</Button>
                </InviteRow>
            </form>
            {invited.map((invite) => {
                return (
                    <InvitedMemberContainer key={invite._id}>
                        <AuthorIcon overrideUserId={invite.invitee._id} size={"50px"}/>
                        <p>{invite.invitee.username}</p>
                        <Button>
                            Revoke Invite
                        </Button>
                    </InvitedMemberContainer>
                );
            })}
            <MemberContainer>
                <label>Members</label>
                {team?.members?.map((m) => <InvitedMemberContainer key={m._id}>
                    <AuthorIcon overrideUserId={m._id} size={"50px"}/>
                    <p>{m.username}</p>
                    <Button>Kick</Button>
                </InvitedMemberContainer>)}
            </MemberContainer>
        </InviteControls>
    </Wrapper>);
}


const Wrapper = styled(FlexRow)`
  width: 100%;
  padding: 1em;
`

const GeneralControls = styled(FlexCol)`
  width: 60%;
`

const InviteControls = styled(FlexCol)`
  flex-grow: 1;
`

const TeamNameInput = styled(Input)`
  max-width: 350px;
`

const InviteRow = styled(FlexRow)`
  width: 100%;
`

const InviteInputWrapper = styled(FlexCol)`
  width: 100%;
  margin-right: 1em;
`

const MemberContainer = styled(FlexCol)`
  padding-top: 1em;
`

const InviteInput = styled(Input)`
  width: 100%;
  margin-right: 1em;
`
const InvitedMemberContainer = styled(FlexRow)`
  justify-content: space-between;
  align-items: center;
  margin-top: 1em;
`;


const IconUpdateContainer = styled(FlexRow)`
  width: 100%;
  /* justify-content: space-between; */
  margin: 1em 0;
`
const IconColumn = styled(FlexCol)`
  height: 100%;
  /* justify-content: space-between; */
  padding-right: 1em;
`