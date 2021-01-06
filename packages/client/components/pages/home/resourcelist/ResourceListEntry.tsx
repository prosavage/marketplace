import styled, { useTheme } from "styled-components";
import { Resource } from "../../../../types/Resource";
import ResourceIcon from "../../../ui/ResourceIcon";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Droplet } from "react-feather";
import { useRecoilState } from "recoil";
import { themeState } from "../../../../styles/atoms/theme";
import timeago from "time-ago";

function ResourceListEntry(props: { resource: Resource }) {
  const [user, setUser] = useState("Loading...");
  const [theme, setTheme] = useRecoilState(themeState);

  const [reviewCount, setReviewCount] = useState(0);

  useEffect(() => {
    setUser("ProSavage");
    setReviewCount(Math.floor(Math.random() * 1000));
  }, []);

  const getReviewDrops = () => {
    const drops = [];
    // const rating = props.resource.rating;
    const rating = Math.floor(Math.random() * 5);
    const remained = 5 - rating;
    const color = theme.accentColor;
    for (let i = 0; i < rating; i++) {
      drops.push(<Droplet size={18} color={color} fill={color} />);
    }

    for (let i = 0; i < remained; i++) {
      drops.push(<Droplet size={18} color={color} />);
    }
    return drops;
  };

  return (
    <Wrapper>
      <ResourceIcon resource={props.resource} size={"100px"} />
      <Metadata>
        <ResourceInfo>
          <TitleArea>
            <h2>{props.resource.name}</h2>
            <Link href={`/users/${props.resource.owner}`}>
              <AuthorLink>{user}</AuthorLink>
            </Link>
          </TitleArea>
          <Description>Pls add descriptions to API.</Description>
        </ResourceInfo>

        <ResourceStats>
          <Review>
            <ReviewDropsContainer>{getReviewDrops()}</ReviewDropsContainer>
            <ReviewCount>{reviewCount} ratings</ReviewCount>
          </Review>
          <DataEntryBottom>
            <DataEntry>
              <Label>Downloads:</Label>
              <Label>{props.resource.downloads}</Label>
            </DataEntry>
            <DataEntry>
              <Label>Updated:</Label>
              <Label>{timeago.ago(props.resource.updated)}</Label>
            </DataEntry>
          </DataEntryBottom>
        </ResourceStats>
      </Metadata>
    </Wrapper>
  );
}

export default ResourceListEntry;

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  padding: 1em;
`;

const Metadata = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  margin: 0 1em;
  justify-content: space-between;

  @media (max-width: 650px) {
    flex-direction: column;
  }
`;

const ResourceInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`;

const AuthorLink = styled.p`
  color: #2fb38b;
  font-size: 10px;
  line-height: 13px;
  cursor: pointer;
`;

const Description = styled.p`
  font-size: 16px;
`;

const TitleArea = styled.div`
  display: flex;
  flex-direction: column;
`;

const ResourceStats = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-width: 12rem;

  @media (max-width: 650px) {
    min-width: auto;
  }
`;

const Review = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  justify-content: space-between;

`;

const ReviewDropsContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-right: 0.5em;
`;

const ReviewCount = styled.p`
  font-size: 14px;
`;

const DataEntry = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const DataEntryBottom = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.p`
  @media (max-width: 650px) {
    display: none;
  }
`;
