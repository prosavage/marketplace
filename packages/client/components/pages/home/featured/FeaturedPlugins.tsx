import { useState } from "react";
import { ArrowLeft, ArrowRight } from "react-feather";
import styled from "styled-components";
import PropsTheme from "../../../../styles/theme/PropsTheme";
import { Resource, ResourceType } from "../../../../types/Resource";
import FeaturedPluginEntry from "./FeaturedPluginEntry";

export default function FeaturedPlugins() {
  const [page, setPage] = useState(1);

  const response= [
    {
      _id: "5fe543e4617b45c9499e40d1",
      name: "FactionsX",
      price: 0,
      hasIcon: false,
      category: "5fe282e1af561421eec33fd6",
      thread: "lolxd",
      owner: "5fe280bc3a1e07215e9bdf59",
      updated: new Date("2020-12-25T01:44:04.997Z"),
      type: ResourceType.PLUGIN,
      rating: 0,
      downloads: 0
    },
    {
      _id: "5fe543e4617b45c9499e40d3",
      name: "WildStacker",
      price: 0,
      hasIcon: false,
      category: "5fe282e1af561421eec33fd6",
      thread: "lolxd",
      owner: "5fe280bc3a1e07215e9bdf59",
      updated: new Date("2020-12-25T01:44:04.997Z"),
      type: ResourceType.PLUGIN,
      rating: 0,
      downloads: 0
    },
    {
      _id: "5fe543e4617b45c9499e40d4",
      name: "VillageDefense",
      price: 0,
      hasIcon: false,
      category: "5fe282e1af561421eec33fd6",
      thread: "lolxd",
      owner: "5fe280bc3a1e07215e9bdf59",
      updated: new Date("2020-12-25T01:44:04.997Z"),
      type: ResourceType.PLUGIN,
      rating: 0,
      downloads: 0
    },
  ];

  return (
    <Wrapper>
      <Header>
        <h2>Featured Plugins</h2>
      </Header>
      <ContentWrapper>
        {response.map((entry) => (
          <FeaturedPluginEntry key={entry._id} resource={entry as Resource} />
        ))}
      </ContentWrapper>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 4px;
  overflow: hidden;
  /* box-shadow: 0px 7px 16px rgba(168, 168, 168, 0.22); */
  border: 1px solid ${(props: PropsTheme) => props.theme.borderColor};
`;

const Header = styled.div`
  padding: 1em 1.5em;
  background: ${(props: PropsTheme) => props.theme.accentColor};
  color: ${(props: PropsTheme) => props.theme.oppositeColor};
`;

const ContentWrapper = styled.div`
  padding: 1em;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
  justify-content: space-evenly;
  background: ${(props: PropsTheme) => props.theme.backgroundSecondary};
  border-radius: 0 0 4px 4px;

  @media (max-width: 800px) {
    flex-direction: column;
  }
`;
