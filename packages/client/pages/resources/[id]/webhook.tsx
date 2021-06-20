import Head from "next/head";
import React from "react";
import ResourceEdit from "../../../components/pages/resource/ResourceEdit";
import { ResourceWebhook } from "../../../components/pages/resource/ResourceWebhook";
import ResourceViewParent from "./../../../components/pages/resource/ResourceViewParent";

export default function ResourceId(props: { id: string }) {

    return (
        <ResourceViewParent
            resourceId={props.id}
            content={((resource) => <>
                <Head>
                    <title>{resource?.name}: Webhooks</title>
                </Head>
                <ResourceWebhook resource={resource}/>
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
