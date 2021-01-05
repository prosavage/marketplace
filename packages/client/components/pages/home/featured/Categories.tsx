import styled from "styled-components";
import PropsTheme from "../../../../styles/theme/PropsTheme";
import { Category } from "../../../../types/Category";
import { ResourceType } from "../../../../types/Resource";
import CategoryEntry from "./CategoryEntry";

function Categories() {

    const response: Category[] = [
        {
          "_id": "5fe282e1af561421eec33fd6",
          "name": "Gamemode",
          "type": ResourceType.PLUGIN
        },
        {
          "_id": "5feec160ae6dd59db8fd9908",
          "name": "Addons",
          "type": ResourceType.PLUGIN
        },
        {
          "_id": "5feec167ae6dd59db8fd9909",
          "name": "Tweaks",
          "type": ResourceType.PLUGIN
        },
        {
          "_id": "5feec16bae6dd59db8fd990a",
          "name": "Anticheat",
          "type": ResourceType.PLUGIN
        }
      ]

    return <Wrapper>
        <Header>
            <p>Categories</p>
        </Header>
        <Content>
                {response.map(entry => <CategoryEntry key={entry._id} category={entry}/>)}
        </Content>
    </Wrapper>
}

export default Categories;

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    flex-basis: 25%;
    border-radius: 4px;
    overflow: hidden;
    border: 1px solid ${(props: PropsTheme) => props.theme.borderColor};
`

const Header = styled.div`
    background: ${(props: PropsTheme) => props.theme.accentColor};
    padding: 0.5em;
`

const Content = styled.div`
    display: flex;
    flex-direction: column;
    margin: 1em;
`

