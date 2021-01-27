import styled from "styled-components";
import PropsTheme from "../../../styles/theme/PropsTheme";
import { Resource } from "../../../types/Resource";
import ResourceWidget from "./ResourceWidget";
import Link from "next/link";

export default function ResourceEdit(props: { resource: Resource }) {
  return (
    <ResourceWidget header={"RESOURCE EDIT"}>
      <Link href={"/edit"}>
        <Text>Edit Resource</Text>
      </Link>
      <Link href={"/edit-icon"}>
        <Text>Edit Resource Icon</Text>
      </Link>
    </ResourceWidget>
  );
}

const Text = styled.p`
  cursor: pointer;
  transition: 250ms ease-ease-in-out;

  &:hover {
    color: ${(props: PropsTheme) => props.theme.accentColor};
  }
`;
