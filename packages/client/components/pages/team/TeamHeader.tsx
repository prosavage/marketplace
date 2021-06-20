import styled from "styled-components";
import PropsTheme from "../../../styles/theme/PropsTheme";
import {FUser, Team, TeamWithUsers, UserStats} from "@savagelabs/types";
import useToast from "../../../util/hooks/useToast";
import AuthorIcon from "../../ui/AuthorIcon";
import Button from "../../ui/Button";
import TeamIcon from "../../ui/TeamIcon";
import React from "react";

export default function TeamHeader(props: {
    team: TeamWithUsers | undefined;
}) {

    const toast = useToast();

    return (
        <Wrapper>
            <ImgContainer>
                <TeamIcon team={props.team} size={"220px"}/>
            </ImgContainer>
            <TextContainer>
                <MetaContainer>
                    <MetaSubContainer>
                        <ResourceHeaderText>{props.team?.name}</ResourceHeaderText>
                        <Date>Member since April 1, 2020</Date>
                    </MetaSubContainer>
                    <MembersContainer>
                        {props.team?.members.concat(props.team?.owner).reverse().map(member => <IconContainer><AuthorIcon size={"50px"} user={member}/></IconContainer>
                          )}
                    </MembersContainer>
                </MetaContainer>
                <ReportButton onClick={() => toast("Coming soon!")}>Report</ReportButton>
            </TextContainer>
        </Wrapper>
    );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  border: 1px solid ${(props: PropsTheme) => props.theme.borderColor};
  padding: 1.5em;
  margin: 1em 0;
  border-radius: 4px;

  @media (max-width: 800px) {
    flex-direction: column;
  }
`;

const ResourceHeaderText = styled.h1`
  word-wrap: break-word;
  @media(max-width: 400px) {
    /* font-size: 20px; */
    max-width: 250px;
  }
`

const Header = styled.h1`
  font-size: 44px;
  line-height: 40px;
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 2em 0.5em;

  @media (max-width: 800px) {
    flex-direction: column;
  }
`;

const ImgContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-basis: 35%;
`;

const MetaContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0 0.5em;
`;

const MetaSubContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1em 0;

  @media (max-width: 800px) {
    justify-content: center;
    text-align: center;
    padding: 0.5em 0;
  }
`;

const MembersContainer = styled.div`
  display: flex;
  /* justify-content: center; */
  @media (max-width: 800px) {
    /* flex-direction: column; */
    /* align-items: center; */
    justify-content: center;
  }
`;

const IconContainer = styled.div`
  margin-right: -10px;
  /* @media (max-width: 400px) { */
    /* margin-right: 0; */

  /* } */
`


const ReportButton = styled(Button)`
  padding: 17.5px 27.5px !important;
  align-self: flex-start;
  margin: 1em 0;

  @media (max-width: 800px) {
    align-self: auto;
  }
`;


const Date = styled.p`
  font-weight: 200;
`;
