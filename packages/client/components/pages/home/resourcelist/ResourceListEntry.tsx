import Link from "next/link";
import Skeleton from "react-loading-skeleton";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import timeago from "time-ago";
import { themeState } from "../../../../atoms/theme";
import PropsTheme from "../../../../styles/theme/PropsTheme";
import { DirectoryResource } from "../../../../types/Resource";
import renderReviewDroplets from "../../../../util/Review";
import FadeDiv from "../../../ui/FadeDiv";
import ResourceIcon from "../../../ui/ResourceIcon";

function ResourceListEntry(props: { resource?: DirectoryResource }) {
  const theme = useRecoilValue(themeState);

  return (
    <Wrapper>
      {props.resource ? (
        <ResourceIcon resource={props.resource} size={"75px"} />
      ) : (
        <Skeleton circle={true} height={75} width={75} />
      )}
      <Metadata>
        <ResourceInfo>
          <TitleArea>
            <Link
              href={`/resources/[id]`}
              as={`/resources/${props.resource?._id}`}
            >
              {props.resource ? (
                <ResourceTitle>{props.resource.name}</ResourceTitle>
              ) : (
                <Skeleton height={24} width={"15em"} />
              )}
            </Link>
            <Link
              href={`/users/[id]`}
              as={`/users/${props.resource?.owner?._id}`}
            >
              {props.resource ? (
                <AuthorLink>{props.resource.owner?.username}</AuthorLink>
              ) : (
                <Skeleton height={10} width={"8em"} />
              )}
            </Link>
          </TitleArea>
          {props.resource ? (
            <Description>{props.resource.description}</Description>
          ) : (
            <Skeleton height={16} width={300} />
          )}
        </ResourceInfo>
        <ResourceStats>
          <Review>
            <ReviewDropsContainer>
              {renderReviewDroplets(theme, props.resource?.rating)}
            </ReviewDropsContainer>
            <ReviewCount>
              {props.resource ? (
                <>
                  {new Intl.NumberFormat().format(props.resource?.reviewCount)}{" "}
                  ratings
                </>
              ) : (
                <Skeleton height={14} width={"5em"} />
              )}
            </ReviewCount>
          </Review>
          <DataEntryBottom>
            <DataEntry>
              <Label>Downloads:</Label>
              <Label>
                {props.resource ? (
                  new Intl.NumberFormat().format(props.resource?.downloads)
                ) : (
                  <Skeleton height={16} width={"3em"} />
                )}
              </Label>
            </DataEntry>
            <DataEntry>
              <>
                <Label>Updated:</Label>
                <Label>
                  {props.resource ? (
                    timeago.ago(props.resource?.updated)
                  ) : (
                    <Skeleton height={16} width={"5em"} />
                  )}
                </Label>
              </>
            </DataEntry>
          </DataEntryBottom>
        </ResourceStats>
      </Metadata>
    </Wrapper>
  );
}

export default ResourceListEntry;

const Wrapper = styled(FadeDiv)`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 1em;
`;

const ResourceTitle = styled.h2`
  transition: 250ms ease-in-out;
  &:hover {
    color: ${(props: PropsTheme) => props.theme.accentColor};
  }
`;

const Metadata = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  margin: 0 1em;
  justify-content: space-between;
  width: 100%;

  @media (max-width: 650px) {
    flex-direction: column;
  }
`;

const ResourceInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 100%;
`;

const AuthorLink = styled.p`
  color: ${(props: PropsTheme) => props.theme.secondaryAccentColor};
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
  width: 100%;
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
