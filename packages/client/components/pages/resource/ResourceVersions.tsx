import { useEffect, useState } from "react";
import styled from "styled-components";
import PropsTheme from "../../../styles/theme/PropsTheme";
import { Resource } from "../../../types/Resource";
import { Version } from "../../../types/Version";
import getAxios from "../../../util/AxiosInstance";
import Button from "../../ui/Button";
import ResourceVersionEntry from "./ResourceVersionEntry";

export default function ResourceVersions({
  resource,
}: {
  resource: Resource | undefined;
}) {
  const [versions, setVersions] = useState<Version[]>([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!resource) return;
    getAxios()
      .get(`/directory/versions/resource/${resource._id}/${page}`)
      .then((res) => setVersions(res.data.payload.versions))
      .catch((err) => console.log(err.response.data));
  }, [page, resource]);

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
    <Wrapper>
      <Header>
        <h2>Versions</h2>
        {renderPageControls()}
      </Header>
      {versions.length > 0 ? versions.map((entry) => (
        <ResourceVersionEntry key={entry._id} version={entry} />
      )) : <p>No versions found.</p>}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1em;
  border: 1px solid ${(props: PropsTheme) => props.theme.borderColor};
  border-radius: 4px;
  margin: 1em 0;
`;

const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const PageControlsWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 1em 0;
`;

const PageButton = styled(Button)`
  &:hover {
    color: ${(props: PropsTheme) => props.theme.accentColor} !important;
  }
`;

const CenterContainer = styled.div`
  margin: 0 1em;
  display: flex;
`;