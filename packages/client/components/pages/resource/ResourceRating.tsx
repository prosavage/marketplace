import { count } from "console";
import { useState } from "react";
import { Droplet } from "react-feather";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { themeState } from "../../../atoms/theme";
import PropsTheme from "../../../styles/theme/PropsTheme";
import Button from "../../ui/Button";

export default function ResourceReview() {
  const theme = useRecoilValue(themeState);

  const [rating, setRating] = useState(0);
  const [preview, setPreview] = useState(true);

  const getRatingDrops = () => {
    const drops = [];
    // const rating = props.resource.rating;
    let counter = 0;
    const size = 25;
    const color = theme.accentColor;
    for (let i = 0; i < 5; i++) {
      drops.push(
        <Droplet
          key={counter}
          size={size}
          color={color}
          fill={i + 1 > rating ? "none" : color}
          onClick={() => {
            setPreview(false)
            setRating(i + 1);
          }}
          onMouseEnter={() => {
            if (preview) {
              setRating(i + 1)
            }
          }}
          onMouseLeave={() => {
            if (preview) {
              setRating(0)
            }
          }}
        />
      );
      counter++;
    }
    return drops;
  };

  return (
    <Wrapper>
      <Title>
        <h1>Ratings</h1>
      </Title>
      <ReviewArea placeholder={"Review goes here..."} />
      <RatingSelect>
        <RatingDrops>{getRatingDrops()}</RatingDrops>
        <p>Selected Rating: {rating}/5</p>
        <Button>Post Review</Button>
      </RatingSelect>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  border: 1px solid ${(props: PropsTheme) => props.theme.borderColor};
  padding: 1em;
  border-radius: 4px;
`;

const Title = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const ReviewArea = styled.textarea`
  height: 150px;
`;
const RatingDrops = styled.div`
  display: flex;
  margin: 0.5em 0;
`;

const RatingSelect = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-top: .5em;
`;
