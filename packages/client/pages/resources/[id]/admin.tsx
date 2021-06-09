import Head from "next/head";
import React from "react";
import ResourceAdmin from "../../../components/pages/resource/ResourceAdmin";
import ResourceViewParent from "./../../../components/pages/resource/ResourceViewParent";

export default function ResourceId(props: { id: string }) {


    return (
        <ResourceViewParent
            resourceId={props.id}
            staffOnly={true}
            content={(resource) => (<>
                <Head>
                    <title>{resource?.name} - Admin Panel</title>
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
