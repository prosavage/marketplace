import Link from "next/link";
import styled, {css} from "styled-components";
import PropsTheme from "../../../../styles/theme/PropsTheme";
import {Category} from "@savagelabs/types";
import {ResourceType} from "@savagelabs/types";

function CategoryEntry(props: { type: ResourceType; category: Category, selected: boolean }) {
    return (
        <Wrapper selected={props.selected}>
            <Link
                href={"/directory/resources/" + props.type + "/" + props.category.name}
            >
                <Text>{props.category.name}</Text>
            </Link>
        </Wrapper>
    );
}

export default CategoryEntry;

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  cursor: pointer;
  transition: 250ms ease-in-out;
  flex-wrap: wrap;

  ${(props: { selected: boolean }) => props.selected && css`
    color: ${(props: PropsTheme) => props.theme.accentColor};
  `}

  &:hover {
    color: ${(props: PropsTheme) => props.theme.accentColor};
  }


  @media(min-width: 1150px) {
    width: 100%;
    flex-wrap: nowrap;
  }
 
`;

const Text = styled.p`
  margin-left: 0.5em;
`;
