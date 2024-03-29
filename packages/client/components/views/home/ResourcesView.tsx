import React from "react";
import styled from "styled-components";
import {ResourceType} from "@savagelabs/types";
import Categories from "./categories/Categories";
import ResourceList from "./resourcelist/ResourceList";

export default function ResourcesView(props: { type: ResourceType, category: string | undefined }) {
    return (
        <Content>
            <CategoriesContainer>
                <Categories type={props.type} category={props.category}/>
            </CategoriesContainer>
            <ResourcesContainer>
                <ResourceList type={props.type} category={props.category} team={undefined}/>
            </ResourcesContainer>
        </Content>
    );
}

const Content = styled.div`
  display: flex;
  flex-direction: row;
  margin: 1em 0;
  width: 100%;

  @media (max-width: 1150px) {
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
`;

const CategoriesContainer = styled.div`
  flex-basis: 25%;

  @media (max-width: 1150px) {
    flex-basis: auto;
    width: 100%;
  }
`;

const ResourcesContainer = styled.div`
  width: 100%;
  margin-left: 1em;

  @media (max-width: 1150px) {
    margin: 1em 0;
  }
`;
