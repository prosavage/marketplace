import Head from "next/head";
import React from "react";
import ResourceAdmin from "../../../components/views/resource/ResourceAdmin";
import ResourceViewParent from "../../../components/views/resource/ResourceViewParent";

export default function ResourceId(props: { id: string }) {


    return (
        <ResourceViewParent
            resourceId={props.id}
            staffOnly={true}
            content={(resource) => (<>
                <Head>
                    <title>{resource?.name}: Admin UI</title>
                </Head>
                <ResourceAdmin resource={resource}/>
            </>)}
        />
    );
}

export async function getServerSideProps({
                                             params
                                         }
) {
    const id = params.id.split(".")[0] as string;

    return {props: {id}};
}
