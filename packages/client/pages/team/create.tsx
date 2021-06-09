import nprogress from "nprogress";
import React, {useEffect, useState} from "react";
import {useRecoilValue} from "recoil";
import styled from "styled-components";
import {userState} from "../../atoms/user";
import AuthorIcon from "../../components/ui/AuthorIcon";
import Button from "../../components/ui/Button";
import {FlexRow} from "../../components/ui/FlexRow";
import Input from "../../components/ui/Input";
import {LinkSpan} from "../../components/ui/LinkSpan";
import {FUser, Resource, Team, Version} from "@savagelabs/types";
import getAxios from "../../util/AxiosInstance";
import useToast from "../../util/hooks/useToast";
import TeamIcon from "../../components/ui/TeamIcon";
import {errorParser, handleAxiosErr} from "../../util/ErrorParser";
import {useRouter} from "next/router";
import {teamState} from "../../atoms/team";
import Head from "next/head";

const TeamCreate: React.FC = ({}) => {
    const me = useRecoilValue(userState);

    const [invited, setInvited] = useState<FUser[]>([]);
    const [inviteEmail, setInviteEmail] = useState("");

    const [name, setName] = useState("")

    const [imgFile, setImgFile] = useState<File | undefined>()


    const toast = useToast();

    const router = useRouter();

    const teams = useRecoilValue(teamState);

    const user = useRecoilValue(userState);

    useEffect(() => {
        if (!teams) return;
        if (teams.map(t => t.owner).includes(user._id)) {
            toast("You can only create a single team.");
            router.push("/team")
            return;
        }
    }, [teams])


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

    const removeInvited = (user: FUser) => {
        setInvited([...invited.filter((iUser) => iUser !== user)]);
    };

    const fileToObjectURL = () => {
        if (!imgFile) {
            return undefined
        }
        return URL.createObjectURL(imgFile)
    }

    const createTeam = () => {
        nprogress.start()

        const hasIcon = imgFile !== undefined

        getAxios().put("/team", {
            name,
            hasIcon,
            members: invited.map(m => m._id)
        }).then(res => {
            if (hasIcon) {
                sendFile(res.data.payload.team)
            } else {
                teamCreated()
            }
        }).catch(err => {
            handleAxiosErr(err)
            nprogress.done();
        })
    }

    const teamCreated = () => {
        nprogress.done();
        // Now that we are done we can redirect!
        router.push(`/team`);
    }

    const sendFile = (team: Team) => {
        const formData = new FormData();
        formData.append("icon", imgFile);
        nprogress.inc();
        getAxios()
            .put(`/team/icon/${team._id}`, formData, {
                headers: { "content-type": "multipart/form-data" },
            })
            .then((res) => {
                teamCreated()
            })
            .catch((err) => {
                handleAxiosErr(err)
                nprogress.done();
            });
    };



    return (
        <Wrapper>
            <Head>
                <title>Create a Team - Marketplace</title>
                <meta name="description" content="Create a Team" />
            </Head>
            <ContentWrapper>
                <h1>Create A Team</h1>
                <ContentContainer>
                    <label>Team Name</label>
                    <Input value={name} onChange={(e) => setName(e.target.value)} invalid={false}
                           placeholder={"A baller team name"}/>
                </ContentContainer>
                <ContentContainer>
                    <label>Team Icon</label>
                    <Input onChange={(e) => setImgFile(e.target.files[0])} invalid={false} type={"file"}/>
                    <TeamIcon style={{marginTop: "1em"}} size={"100px"} overrideSrc={fileToObjectURL()}/>
                </ContentContainer>
                <ContentContainer style={{marginTop: "2em"}}>
                    <h2>Invite Team Members</h2>
                </ContentContainer>
                <form>
                    <FlexRow>
                        <Input
                            value={inviteEmail}
                            onChange={(e) => setInviteEmail(e.target.value)}
                            style={{marginRight: "1em", flexGrow: 1}}
                            type={"email"}
                            placeholder={"invite user by email"}
                        />
                        <Button type={"submit"} onClick={inviteUser}>
                            Invite
                        </Button>
                    </FlexRow>
                </form>
                <ContentContainer>
                    <p>Invited Members ({invited.length})</p>
                    <p>
                        Team Members can accept invites on the{" "}
                        <LinkSpan href={"/account"}>account</LinkSpan> page.
                    </p>
                    {invited.map((user) => {
                        return (
                            <InvitedMemberContainer key={user._id}>
                                <AuthorIcon user={user} size={"50px"}/>
                                <p>{user.username}</p>
                                <Button onClick={() => removeInvited(user)}>
                                    Remove Invite
                                </Button>
                            </InvitedMemberContainer>
                        );
                    })}
                </ContentContainer>
                <ContentContainer>
                    <Button onClick={createTeam}>CREATE TEAM</Button>
                </ContentContainer>
            </ContentWrapper>
        </Wrapper>
    );
};

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 1em 0.5em;
`;

const InvitedMemberContainer = styled(FlexRow)`
  justify-content: space-between;
  align-items: center;
  margin-top: 1em;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 1em;
`;

const ContentWrapper = styled.div`
  max-width: 400px;
  margin: 0 1em;
`;

export default TeamCreate;
