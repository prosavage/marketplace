import React from "react";
import { Droplet } from "react-feather";
import ITheme from "../styles/theme/ITheme";

const renderReviewDroplets = (theme: ITheme) => {
    const drops = [];
    // const rating = props.resource.rating;
    const rating = Math.floor(Math.random() * 5);
    let counter = 0;
    const remain = 5 - rating;
    const color = theme.accentColor;
    for (let i = 0; i < rating; i++) {
      drops.push(
        <Droplet key={counter} size={18} color={color} fill={color} />
      );
      counter++;
    }
    for (let i = 0; i < remain; i++) {
      drops.push(
        <Droplet key={counter} size={18} color={color} fill={"none"} />
      );
      counter++;
    }
    return drops;
  };

  export default renderReviewDroplets;