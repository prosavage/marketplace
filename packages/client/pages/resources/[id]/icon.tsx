import Head from "next/head";
import React from "react";
import ResourceIcon from "../../../components/pages/resource/ResourceIcon";
import ResourceViewParent from "./../../../components/pages/resource/ResourceViewParent";

export default function ResourceId(props: { id: string }) {


    return (
        <ResourceViewParent
            resourceId={props.id}
            content={resource => <>
                <Head>
                    <title>{resource?.name} - Edit Icon</title>
                </Head>
                <ResourceIcon resource={resource}/>
            </>}
        />
    );
}

export async function getServerSideProps({
    params
}
)
{
    const id = params.id.split(".")[0] as string;

    return {props: {id}};
}
