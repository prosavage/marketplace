import React, {useEffect} from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import styled from "styled-components";
import { teamState } from "../../atoms/team";
import { userState } from "../../atoms/user";
import TeamNavbar from "../../components/pages/team/TeamNavbar";
import { TeamOverviewEntry } from "../../components/pages/team/TeamOverviewEntry";
import { FlexCol } from "../../components/ui/FlexRow";
import {LinkSpan} from "../../components/ui/LinkSpan";
import getAxios from "../../util/AxiosInstance";
import Head from "next/head";


const TeamHome: React.FC = ({ }) => {

    const [teams, setTeams] = useRecoilState(teamState);

    const user = useRecoilValue(userState);

    const fetchTeam = () => {
        getAxios().get("/directory/team/by-member/" + user._id).then(res => {
          if (res.data.payload.team !== null) {
            setTeams(res.data.payload.team)
            console.log("fetched and set team atom.")
          } else {
            setTeams([])
            console.log("not a team member.")
          }
        })
      }

    const renderTeamHelp = () => {
        if (teams?.length > 0) return <p>You are part of the following teams, you can manage teams that you own.</p>
        return <>
        <p>You aren't part of any teams, <LinkSpan href={"/team/create"}>create one</LinkSpan>, or ask to be invited to one. </p>
        </>
    }


    useEffect(() => {
        // need to wait for login to fetch teams.
        if (!user) return
        fetchTeam()
    }, [user])

    return <Wrapper>
        {/* <TeamNavbar /> */}
        <Head>
            <title>Teams - Marketplace</title>
            <meta name="description" content="Teams List" />
        </Head>
        <TeamsList>
            <TeamListWrapper>
                <h1>Teams</h1>
                {renderTeamHelp()}
                {teams?.map(team => <TeamOverviewEntry key={team?._id} team={team} />)}
            </TeamListWrapper>
        </TeamsList>
    </Wrapper>

}

export default TeamHome;
const Wrapper = styled(FlexCol)`
    width: 100%;
`

const TeamsList = styled(FlexCol)`
    width: 100%;
    padding: 1em;
    align-items: center;

`

const TeamListWrapper = styled(FlexCol)`
    width: 100%;
    max-width: 1280px;

`

