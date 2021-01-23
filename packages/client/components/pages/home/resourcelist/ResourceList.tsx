import { useEffect, useState } from "react";
import styled from "styled-components";
import PropsTheme from "../../../../styles/theme/PropsTheme";
import { Resource, ResourceType } from "../../../../types/Resource";
import getAxios from "../../../../util/AxiosInstance";
import ResourceListEntry from "./ResourceListEntry";
import Button from "./../../../ui/Button";
import { User } from "../../../../types/User";

function ResourceList(props: {
  type: ResourceType;
  category: string | undefined;
  author: User | undefined;
}) {
  const [resources, setResources] = useState<Resource[]>([]);
  const [page, setPage] = useState(1);

  // component stays mounted...
  // so we need to change page back to 1 if a category/type is changed
  useEffect(() => {
    setPage(1);
  }, [props.category, props.type]);

  useEffect(() => {
    let url = "/directory/resources/type/" + props.type + "/" + page;

    if (props.category) {
      url =
        "/directory/resources/category/" +
        props.type +
        "/" +
        props.category +
        "/" +
        page;
    }

    if (props.author) {
      console.log(props.author);
      url = "/directory/resources/author/" + props.author?._id + "/" + page;
    }

    getAxios()
      .get(url)
      .then((res) => {
        setResources(res.data.payload.resources);
      });
  }, [props.type, props.category, page, props.author]);

  const renderPageControls = () => {
    return (
      <PageControlsWrapper>
        <PageButton
          onClick={() => {
            if (page <= 1) {
              return;
            }
            setPage(page - 1);
          }}
        >
          &larr;
        </PageButton>
        <CenterContainer>{page}</CenterContainer>
        <PageButton onClick={() => setPage(page + 1)}>&rarr;</PageButton>
      </PageControlsWrapper>
    );
  };

  return (
    <>
      <Wrapper>
        <TitleContainer>
          <h2>{props.category} Resources</h2>
          {renderPageControls()}
        </TitleContainer>
        {resources.length > 0 ? (
          resources.map((entry) => (
            <ResourceListEntry key={entry._id} resource={entry} />
          ))
        ) : (
          <NoResourcesFoundContainer>
            <p>No resources found.</p>
          </NoResourcesFoundContainer>
        )}
      </Wrapper>
    </>
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

const PageControlsWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 1em 0;
`;

const CenterContainer = styled.div`
  margin: 0 1em;
  display: flex;
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 1em;
  width: 100%;
  border-bottom: 1px solid ${(props: PropsTheme) => props.theme.borderColor};
  background: ${(props: PropsTheme) => props.theme.accentColor};
  color: black;
  border-radius: 4px 4px 0 0;
`;

const PageButton = styled(Button)`
  &:hover {
    border: 1px solid ${(props: PropsTheme) => props.theme.borderColor} !important;
    color: ${(props: PropsTheme) => props.theme.accentColor} !important;
  }
`;

const NoResourcesFoundContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 1em;
`;
