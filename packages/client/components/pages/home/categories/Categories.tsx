import { useEffect, useState } from "react";
import styled from "styled-components";
import PropsTheme from "../../../../styles/theme/PropsTheme";
import { ResourceType } from "@savagelabs/types";
import getAxios from "../../../../util/AxiosInstance";
import CategoryEntry from "./CategoryEntry";

function Categories(props: {
  type: ResourceType;
  category: string | undefined;
}) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let fetchURL = "/directory/categories/" + props.type;

    getAxios()
      .get(fetchURL)
      .then((res) => {
        setLoading(false);
        setCategories(res.data.payload.categories);
      });
  }, [props.type]);

  const renderCategories = () => {
    if (loading) {
      return <></>
    }
     
    return categories.map((entry) => (
      <CategoryEntry
        key={entry._id}
        type={props.type}
        category={entry}
        selected={props.category === entry.name}
      />
    ));
  };

  return (
    <Wrapper>
      <Header>
        <TextBox>Categories</TextBox>
      </Header>
      <Content>{renderCategories()}</Content>
    </Wrapper>
  );
}

export default Categories;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid ${(props: PropsTheme) => props.theme.borderColor};
`;
const TextBox = styled.h2`
  color: ${(props: PropsTheme) => props.theme.oppositeColor};
`;
const Header = styled.div`
  background: ${(props: PropsTheme) => props.theme.accentColor};
  padding: .5em 1em;
  color: black;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  margin: 1em;
`;
