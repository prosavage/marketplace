import Link from "next/link";
import { useEffect, useState } from "react";
import { MessageSquare, Trash } from "react-feather";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import timeago from "time-ago";
import { themeState } from "../../../atoms/theme";
import { userState } from "../../../atoms/user";
import PropsTheme from "../../../styles/theme/PropsTheme";
import { Review } from "@savagelabs/types";
import { FUser } from "@savagelabs/types";
import getAxios from "../../../util/AxiosInstance";
import useToast from "../../../util/hooks/useToast";
import renderReviewDroplets from "../../../util/Review";
import AuthorIcon from "../../ui/AuthorIcon";

export default function ReviewEntry({
  review,
  onDelete,
}: {
  review?: Review;
  onDelete: () => void;
}) {
  const [user, setUser] = useState<FUser>();
  const theme = useRecoilValue(themeState);
  const toast = useToast();

  const me = useRecoilValue(userState);

  useEffect(() => {
    getAxios()
      .get(`/directory/user/by-id/${review.author}`)
      .then((res) => {
        setUser(res.data.payload.user);
      });
  }, []);

  const deleteReview = () => {
    getAxios()
      .delete(`/review/${review._id}`)
      .then((res) => {
        toast("Review deleted successfully");
        onDelete();
      })
      .catch((err) => console.log(err.response.data));
  };

  return (
    <Wrapper>
      <AuthorIcon user={user} size={"96px"} />
      <Content>
        <BottomRow>
          <Link href={"/users/[id]"} as={`/users/${user?._id}`}>
            <AuthorLink>{user?.username}</AuthorLink>
          </Link>
          <ReviewDropsContainer>
            {renderReviewDroplets(theme, review.rating)}
          </ReviewDropsContainer>
        </BottomRow>
        <Message>{review.message}</Message>
        <BottomRow>
          <p>{timeago.ago(review.timestamp)}</p>
          <ButtonContainer>
            <Spacer>
              <MessageSquare onClick={() => toast(`Coming Soon`)} />
            </Spacer>
            {me?._id === user?._id && (
              <Spacer>
                <Trash onClick={deleteReview} />
              </Spacer>
            )}
          </ButtonContainer>
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

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Spacer = styled.div`
  margin: 0 0.5em;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const AuthorLink = styled.p`
  color: ${(props: PropsTheme) => props.theme.accentColor};
  cursor: pointer;
`;

// Important or you can send one LONG line with no space between and ruin styling.
const Message = styled.p`
  word-break: break-all;
`;
