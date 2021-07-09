import Head from "next/head";
import React from "react";
import ResourceUpdate from "../../../components/views/resource/ResourceUpdate";
import ResourceViewParent from "../../../components/views/resource/ResourceViewParent";

export default function ResourceId(props: { id: string }) {


    return (
        <ResourceViewParent
            resourceId={props.id}
            content={(resource => <>
                <Head>
                    <title>{resource?.name}: Update</title>
                </Head>
                <ResourceUpdate resource={resource} onSubmit={() => {
                }}/>
            </>)}
        />
    );
}

export async function getServerSideProps(
{
    params
}
)
{
    const id = params.id.split(".")[0] as string;

    return {props: {id}};
}
