import React, { ReactFragment } from "react";
import { TrendingUp } from "react-feather";
import styled from "styled-components";
import PropsTheme from "../../../styles/theme/PropsTheme";

export default function ResourceWidget(props: {
  header: string;
  children: ReactFragment;
}) {
  return (
    <Wrapper>
      <PluginInfoHeader>
        <TrendingUp style={{ margin: "0 1em" }} />
        <h3>{props.header}</h3>
      </PluginInfoHeader>
      <InfoDataContainer>
        {props.children}
      </InfoDataContainer>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  border: 1px solid ${(props: PropsTheme) => props.theme.borderColor};
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 1em;
`;

const PluginInfoHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 1em;
  background: ${(props: PropsTheme) => props.theme.accentColor};
  color: black;
`;

const InfoDataContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1em;
`;

export const PluginInfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;
