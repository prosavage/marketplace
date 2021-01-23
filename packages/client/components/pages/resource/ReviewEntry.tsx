import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { themeState } from "../../../atoms/theme";
import PropsTheme from "../../../styles/theme/PropsTheme";
import { Review } from "../../../types/Review";
import getAxios from "../../../util/AxiosInstance";
import renderReviewDroplets from "../../../util/Review";
import AuthorIcon from "../../ui/AuthorIcon";
import timeago from "time-ago";
import { User } from "../../../types/User";
import Link from "next/link";

export default function ReviewEntry({ review }: { review: Review }) {
  const [user, setUser] = useState<User>();
  const theme = useRecoilValue(themeState);

  useEffect(() => {
    getAxios()
      .get(`/directory/user/${review.author}`)
      .then((res) => {
        setUser(res.data.payload.user);
      });
  }, []);

  return (
    <Wrapper>
      <AuthorIcon user={user} size={"64px"} />
      <Content>
        <ReviewDropsContainer>
          {renderReviewDroplets(theme, review.rating)}
        </ReviewDropsContainer>
        <p>{review.message}</p>
        <BottomRow>
          <Link href={`/users/${user?._id}`}>
            <AuthorLink>{user?.username}</AuthorLink>
          </Link>
          <p>{timeago.ago(review.timestamp)}</p>
        </BottomRow>
      </Content>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  border: 1px solid ${(props: PropsTheme) => props.theme.borderColor};
  padding: 1em;
  margin: 0.5em 0;
  border-radius: 4px;
  align-items: center;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 1em;
  justify-content: center;
  width: 100%;
`;

const ReviewDropsContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const BottomRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const AuthorLink = styled.p`
  color: #00b2ff;
  cursor: pointer;
`;
