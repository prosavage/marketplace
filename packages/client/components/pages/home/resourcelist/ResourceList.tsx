import { useEffect, useState } from "react";
import styled from "styled-components";
import PropsTheme from "../../../../styles/theme/PropsTheme";
import { Resource, ResourceType } from "../../../../types/Resource";
import getAxios from "../../../../util/AxiosInstance";
import ResourceListEntry from "./ResourceListEntry";
import Button from "./../../../ui/Button";

function ResourceList(props: {
  type: ResourceType;
  category: string | undefined;
}) {
  const [resources, setResources] = useState<Resource[]>([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    let url = "/directory/resources/type/" + props.type + "/" + page;
    if (props.category) {
      url = "/directory/resources/category/" + props.type + "/" + props.category + "/" + page
    }

    getAxios()
      .get(url)
      .then((res) => {
        setResources(res.data.payload.resources);
      });
  }, [props.type, props.category, page]);

  const renderPageContros = () => {
    return (
      <PageControlsWrapper>
        <Button onClick={() => {
          if (page <= 1) {
            return;
          } 
          setPage(page - 1)
        }}>&larr;</Button>
        <CenterContainer>
          <p>{page}</p>
        </CenterContainer>
        <Button onClick={() => setPage(page + 1)}>&rarr;</Button>
      </PageControlsWrapper>
    );
  };

  return (
    <>
      <Wrapper>
        {resources.map((entry) => (
          <ResourceListEntry key={entry._id} resource={entry} />
        ))}
      </Wrapper>
      {renderPageContros()}
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
  width: 100%;
  justify-content: center;
  align-items: center;
  margin: 1em 0;
`;

const CenterContainer = styled.div`
  margin: 0 1em;
`;
