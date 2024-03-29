import Head from "next/head";
import React from "react";
import styled from "styled-components";
import ResourcesView from "../../../../components/views/home/ResourcesView";
import SubNavbar from "../../../../components/views/home/SubNavbar";
import {ResourceType} from "@savagelabs/types";

export default function Resource(props: {
    type: ResourceType;
    category: string | undefined;
}) {
    return (
        <>
            <Head>
                <title>{props.category} - {props.type}</title>
                <meta name="description" content={props.category + props.type}/>
            </Head>
            <SubNavbar/>
            <Wrapper>
                <ResourcesView type={props.type} category={props.category}/>
            </Wrapper>
        </>
    );
}

export async function getServerSideProps({params}) {
    const resourceType = params.type as string;
    const category = params.category as string;
    const resType = resourceType as ResourceType;
    return {props: {type: resType, category}};
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  padding: 2em;
  margin: 1em 0;
`;
