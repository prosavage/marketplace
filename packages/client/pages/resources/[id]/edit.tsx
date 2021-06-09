import Head from "next/head";
import React from "react";
import ResourceEdit from "../../../components/pages/resource/ResourceEdit";
import ResourceViewParent from "./../../../components/pages/resource/ResourceViewParent";

export default function ResourceId(props: { id: string }) {

    return (
        <ResourceViewParent
            resourceId={props.id}
            content={((resource) => <>
                <Head>
                    <title>{resource?.name} - Edit Resource</title>
                </Head>
                <ResourceEdit resource={resource}/>
            </>)}
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
