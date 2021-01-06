import styled from "styled-components";
import PropsTheme from "../../../../styles/theme/PropsTheme";
import { Resource, ResourceType } from "../../../../types/Resource";
import ResourceListEntry from "./ResourceListEntry";

function ResourceList() {
  const resource: Resource[] = [
    {
      _id: "5ff5098a7145b222fc170dc0",
      name: "VillageDefense",
      category: "5ff501d2ccbc510598e40020",
      thread: "cool",
      owner: "5ff5018f90a7f7554427af6d",
      updated: new Date("2021-01-06T00:51:22.861Z"),
      type: ResourceType.PLUGIN,
      price: 0,
      rating: 0,
      downloads: 0,
    },
    {
      _id: "5ff5097e7145b222fc170dbf",
      name: "SuperiorSkyblock",
      category: "5ff501d2ccbc510598e40020",
      thread: "cool",
      owner: "5ff5018f90a7f7554427af6d",
      updated: new Date("2021-01-06T00:51:10.987Z"),
      type: ResourceType.PLUGIN,
      price: 0,
      rating: 0,
      downloads: 0,
    },
    {
      _id: "5ff5097a7145b222fc170dbe",
      name: "SuperiorPrison",
      category: "5ff501d2ccbc510598e40020",
      thread: "cool",
      owner: "5ff5018f90a7f7554427af6d",
      updated: new Date("2021-01-06T00:51:06.043Z"),
      type: ResourceType.PLUGIN,
      price: 0,
      rating: 0,
      downloads: 0,
    },
    {
      _id: "5ff509737145b222fc170dbd",
      name: "WildTools",
      category: "5ff501d2ccbc510598e40020",
      thread: "cool",
      owner: "5ff5018f90a7f7554427af6d",
      updated: new Date("2021-01-06T00:50:59.568Z"),
      type: ResourceType.PLUGIN,
      price: 0,
      rating: 0,
      downloads: 0,
    },
    {
      _id: "5ff5096d7145b222fc170dbc",
      name: "WildStacker",
      category: "5ff501d2ccbc510598e40020",
      thread: "cool",
      owner: "5ff5018f90a7f7554427af6d",
      updated: new Date("2021-01-06T00:50:53.618Z"),
      type: ResourceType.PLUGIN,
      price: 0,
      rating: 0,
      downloads: 0,
    },
    {
      _id: "5ff5095a7145b222fc170dbb",
      name: "SkyblockX",
      category: "5ff501d2ccbc510598e40020",
      thread: "cool",
      owner: "5ff5018f90a7f7554427af6d",
      updated: new Date("2021-01-06T00:50:34.434Z"),
      type: ResourceType.PLUGIN,
      price: 0,
      rating: 0,
      downloads: 0,
    },
    {
      _id: "5ff509557145b222fc170dba",
      name: "FactionsX",
      category: "5ff501d2ccbc510598e40020",
      thread: "cool",
      owner: "5ff5018f90a7f7554427af6d",
      updated: new Date("2021-01-06T00:50:29.983Z"),
      type: ResourceType.PLUGIN,
      price: 0,
      rating: 0,
      downloads: 0,
    },
    {
      _id: "5ff5094d7145b222fc170db9",
      name: "FWild-Addon",
      category: "5ff501d2ccbc510598e40020",
      thread: "cool",
      owner: "5ff5018f90a7f7554427af6d",
      updated: new Date("2021-01-06T00:50:21.682Z"),
      type: ResourceType.PLUGIN,
      price: 0,
      rating: 0,
      downloads: 0,
    },
    {
      _id: "5ff509477145b222fc170db8",
      name: "FGrace-Addon",
      category: "5ff501d2ccbc510598e40020",
      thread: "cool",
      owner: "5ff5018f90a7f7554427af6d",
      updated: new Date("2021-01-06T00:50:15.571Z"),
      type: ResourceType.PLUGIN,
      price: 0,
      rating: 0,
      downloads: 0,
    },
    {
      _id: "5ff509427145b222fc170db7",
      name: "FRoster-Addon",
      category: "5ff501d2ccbc510598e40020",
      thread: "cool",
      owner: "5ff5018f90a7f7554427af6d",
      updated: new Date("2021-01-06T00:50:10.168Z"),
      type: ResourceType.PLUGIN,
      price: 0,
      rating: 0,
      downloads: 0,
    },
  ];

  return (
    <Wrapper>
      {resource.map((entry) => (
        <ResourceListEntry resource={entry} />
      ))}
    </Wrapper>
  );
}

export default ResourceList;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  border: 1px solid ${(props: PropsTheme) => props.theme.borderColor};
  border-radius: 5px;
`;
