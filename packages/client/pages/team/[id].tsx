import { ResourceType, TeamWithUsers } from "@savagelabs/types";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import ResourceList from "../../components/views/home/resourcelist/ResourceList";
import TeamHeader from "../../components/views/team/TeamHeader";
import getAxios from "../../util/AxiosInstance";
import { handleAxiosErr } from "../../util/ErrorParser";


export default function TeamById(props: { id: string }) {

    const [team, setTeam] = useState<TeamWithUsers>();
  
    useEffect(() => {
      getAxios()
        .get(`/directory/team/with-members/${props.id}`)
        .then((res) => {
          setTeam(res.data.payload.team);
        }).catch(err => handleAxiosErr(err));
    }, []);


    return <Wrapper>
        <TeamHeader team={team}/>
        <ResourcesContainer>
        <ResourceList
          type={ResourceType.PLUGIN}
          category={undefined}
          team={team}
        />
      </ResourcesContainer>
    </Wrapper>

}


export async function getServerSideProps({ params }) {
    const id = params.id as string;
  
    return { props: { id } };
  }


  const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 2em 0;
  padding: 0 1em;
  width: 100%;
`;

const ResourcesContainer = styled.div`
  width: 100%;
  margin: 1em 0;
`;
