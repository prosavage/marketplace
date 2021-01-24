import styled from "styled-components";
import { Resource } from "../../../../types/Resource";
import ResourceIcon from "../../../ui/ResourceIcon";
import Link from "next/link";
import { useEffect, useState } from "react";
import { themeState } from "../../../../atoms/theme";
import timeago from "time-ago";
import { useRecoilValue } from "recoil";
import renderReviewDroplets from "../../../../util/Review";
import { User } from "../../../../types/User";
import getAxios from "../../../../util/AxiosInstance";

function ResourceListEntry(props: { resource: Resource }) {
  const [user, setUser] = useState<User>();
  const theme = useRecoilValue(themeState);

  const [reviewCount, setReviewCount] = useState(0);

  useEffect(() => {
    getAxios()
      .get(`/directory/user/${props.resource.owner}`)
      .then((res) => setUser(res.data.payload.user))
      .catch((err) => console.log(err.response.data));

    getAxios()
      .get(`/directory/reviews/${props.resource._id}`)
      .then((res) => setReviewCount(res.data.payload.reviews.length))
      .catch((err) => console.log(err.response.data));
  }, []);

  return (
    <Wrapper>
      <ResourceIcon resource={props.resource} size={"100px"} />
      <Metadata>
        <ResourceInfo>
          <TitleArea>
            <Link href={`/resources/${props.resource._id}`}>
              <h2>{props.resource.name}</h2>
            </Link>
            <Link href={`/users/${props.resource.owner}`}>
              <AuthorLink>{user?.username}</AuthorLink>
            </Link>
          </TitleArea>
          <Description>{props.resource.description}</Description>
        </ResourceInfo>
        <ResourceStats>
          <Review>
            <ReviewDropsContainer>
              {renderReviewDroplets(theme, props.resource.rating)}
            </ReviewDropsContainer>
            <ReviewCount>
              {new Intl.NumberFormat().format(reviewCount)} ratings
            </ReviewCount>
          </Review>
          <DataEntryBottom>
            <DataEntry>
              <Label>Downloads:</Label>
              <Label>
                {new Intl.NumberFormat().format(props.resource.downloads)}
              </Label>
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
  color: #00b2ff;
  font-size: 10px;
  line-height: 13px;
`;

const Description = styled.p`
  font-size: 16px;
`;

const TitleArea = styled.div`
  display: flex;
  flex-direction: column;
  cursor: pointer;
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
