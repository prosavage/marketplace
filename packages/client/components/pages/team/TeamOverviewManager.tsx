import {FUser, Team, TeamInvite, TeamInviteWithUser, TeamWithUsers} from "@savagelabs/types";
import React, {useEffect, useState} from "react";
import styled from "styled-components";
import getAxios from "../../../util/AxiosInstance";
import AuthorIcon from "../../ui/AuthorIcon";
import {FlexCol, FlexRow} from "../../ui/FlexRow";
import Input from "../../ui/Input";
import TeamIcon from "../../ui/TeamIcon";
import Button from "./../../ui/Button";
import nprogress from "nprogress"
import {useRecoilState, useRecoilValue} from "recoil";
import {userState} from "../../../atoms/user";
import useToast from "../../../util/hooks/useToast";
import {handleAxiosErr} from "../../../util/ErrorParser";

interface TeamOverviewManagerProps {
    initTeam?: TeamWithUsers
    invites: TeamInviteWithUser[]
}

export const TeamOverviewManager: React.FC<TeamOverviewManagerProps> = ({initTeam, invites}) => {

    const [invited, setInvited] = useState<TeamInviteWithUser[]>(invites)

    const [inviteEmail, setInviteEmail] = useState("");

    const [team , setTeam] = useState<TeamWithUsers>(initTeam)

    const [icon, setIcon] = useState<File>();




    useEffect(() => {
        setInvited(invites)
    }, [invites])

    const me = useRecoilValue(userState);

    const toast = useToast()

    const fileToObjectURL = () => {
        if (!icon) {
            return undefined
        }
        return URL.createObjectURL(icon)
    }

    const applyIcon = () => {
        if (!icon) {
            toast("You did not upload a new icon!");
            return
        }
        nprogress.start();

        const formData = new FormData();
        formData.append("icon", icon);
        nprogress.inc();
        getAxios()
            .put(`/team/icon/${team._id}`, formData, {
                headers: { "content-type": "multipart/form-data" },
            })
            .then((res) => {
                toast("Icon Uploaded!");
                nprogress.done()
                return;
            })
            .catch((err) => {
                handleAxiosErr(err)
                nprogress.done();
            });
    }
    
    
    const inviteUser = (e) => {
        e.preventDefault();

        nprogress.start();
        getAxios()
            .get("/directory/user/by-email/" + inviteEmail)
            .then((res) => {
                const user: FUser = res.data.payload.user;


                if (me._id === user._id) {
                    toast("You cannot invite yourself.")
                } else if (!invited.map((tUser) => tUser._id).includes(user._id)) {
                    sendInvite(user)
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

    const sendInvite = (invitee: FUser) => {
        getAxios().put("/invite", {
            invitee: invitee._id,
            team: team._id
        }).then(res => {
            const invite: TeamInvite = res.data.payload.invite
            const teamInviteWithUser: TeamInviteWithUser = {_id: invite._id, team: invite.team, invitee}
            setInvited([teamInviteWithUser, ...invited])
        }).catch(err => handleAxiosErr(err));
    }

    const revoke = (teamInvite: TeamInviteWithUser) => {
        getAxios().delete("/invite/" + teamInvite._id).then(res => {
            setInvited([...invited.filter(inv => inv._id !== teamInvite._id)])
        }).catch(err => handleAxiosErr(err))
    }

    const kick = (member: FUser) => {
        getAxios().post("/directory/team/member/kick", {
            member: member._id
        }).then(res => {
            setTeam({...team, members: [...team.members.filter(memb => memb._id !== member._id)]})
        }).catch(err => handleAxiosErr(err))
    }

    return (<Wrapper>
        <GeneralControls>
            <label>Team Name</label>
            <TeamNameInput defaultValue={team.name}/>
            <IconUpdateContainer>
                <IconColumn>
                    <label>Update Team Icon</label>
                    <Input style={{width: "100%"}} type={"file"} onChange={(e) => setIcon(e.target.files[0])} />
                    <IconApplyContainer>
                        <Button onClick={applyIcon}>APPLY</Button>
                    </IconApplyContainer>
                </IconColumn>
                <TeamIcon style={{marginTop: "1em"}} size={"100px"} team={team} overrideSrc={fileToObjectURL()}/>
            </IconUpdateContainer>
        </GeneralControls>
        <InviteControls>
            <label>Invites</label>
            <form>
                <InviteRow>
                    <InviteInput value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)}
                                 placeholder={"User's Email"}/>
                    <Button type={"submit"} onClick={inviteUser}>INVITE</Button>
                </InviteRow>
            </form>
            {invited.map((invite) => {
                return (
                    <InvitedMemberContainer key={invite._id}>
                        <AuthorIcon overrideUserId={invite.invitee._id} size={"50px"}/>
                        <p>{invite.invitee.username}</p>
                        <Button onClick={() => revoke(invite)}>
                            Revoke Invite
                        </Button>
                    </InvitedMemberContainer>
                );
            })}
            <MemberContainer>
                <label>Members</label>
                {team?.members?.length !== 0 ? team?.members.map((m) => <InvitedMemberContainer key={m._id}>
                    <AuthorIcon overrideUserId={m._id} size={"50px"}/>
                    <p>{m.username}</p>
                    <Button onClick={() => kick(m)}>Kick</Button>
                </InvitedMemberContainer>) : <p>You have no team members yet.</p>}
            </MemberContainer>
        </InviteControls>
    </Wrapper>);
}


const Wrapper = styled(FlexRow)`
  width: 100%;
  padding: 1em;
  @media(max-width: 825px) {
      flex-direction: column;
  }
`

const IconApplyContainer = styled.div`
    margin: 1em 0;
`

const GeneralControls = styled(FlexCol)`
  width: 60%;
  padding-right: 1em;
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

  @media(max-width: 400px) {
    flex-direction: column;
  }
`
const IconColumn = styled(FlexCol)`
  height: 100%;
  width: 100%;
  /* justify-content: space-between; */
  padding-right: 1em;
`