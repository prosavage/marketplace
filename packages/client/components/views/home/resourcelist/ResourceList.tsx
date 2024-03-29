import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight } from "react-feather";
import styled from "styled-components";
import PropsTheme from "../../../../styles/theme/PropsTheme";
import { DirectoryResource, ResourceType, Team, TeamWithUsers } from "@savagelabs/types/index";
import getAxios from "../../../../util/AxiosInstance";
import ResourceListEntry from "./ResourceListEntry";
import { handleAxiosErr } from "../../../../util/ErrorParser";

function ResourceList(props: {
  type: ResourceType;
  category: string | undefined;
  team: Team | TeamWithUsers | undefined;
}) {
  const [resources, setResources] = useState<DirectoryResource[]>([]);
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);

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

    if (props.team) {
      url = "/directory/resources/team/" + props.team?._id + "/" + page;
    }

    setLoading(true);
    getAxios()
      .get(url)
      .then((res) => {
        setLoading(false);
        setResources(res.data.payload.resources);
      }).catch(err => handleAxiosErr(err));
  }, [props.type, props.category, page, props.team]);

  const renderPageControls = () => {
    return (
      <PageControlsWrapper>
        <BackArrow
          onClick={() => {
            if (page <= 1) {
              return;
            }
            setPage(page - 1);
          }}
        >
          &larr;
        </BackArrow>
        <CenterContainer>{page}</CenterContainer>
        <ForwardArrow onClick={() => setPage(page + 1)}>&rarr;</ForwardArrow>
      </PageControlsWrapper>
    );
  };

  const renderResources = () => {
    if (loading) {
     return <></>
    } else {
      if (resources.length === 0) {
        return (
          <NoResourcesFoundContainer>
            <p>No resources found.</p>
          </NoResourcesFoundContainer>
        );
      } else {
        return resources.map((entry) => (
          <ResourceListEntry key={entry._id} resource={entry} />
        ));
      }
    }
  };

  return (
    <>
      <Wrapper>
        <TitleContainer>
          <h2>{props.category} Resources</h2>
          {renderPageControls()}
        </TitleContainer>
        {renderResources()}
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

const BackArrow = styled(ArrowLeft)`
  cursor: pointer;
  transition: 250ms ease-in-out;
  &:hover {
    stroke-width: 3;
  }
`;
const ForwardArrow = styled(ArrowRight)`
  cursor: pointer;
  transition: 250ms ease-in-out;
  &:hover {
    stroke-width: 3;
  }
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
  color: ${(props: PropsTheme) => props.theme.oppositeColor};
  border-radius: 4px 4px 0 0;
`;

const NoResourcesFoundContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 1em;
`;
