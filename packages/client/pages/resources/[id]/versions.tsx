import Head from "next/head";
import {useRouter} from "next/router";
import React from "react";
import ResourceVersions from "../../../components/pages/resource/ResourceVersions";
import ResourceViewParent from "./../../../components/pages/resource/ResourceViewParent";

export default function ResourceId(props: { id: string }) {

    const router = useRouter();


    return (
        <ResourceViewParent
            resourceId={props.id}
            content={(resource) => <>

                <Head>
                    <title>{resource?.name}: Version List</title>
                </Head>
                <ResourceVersions
                    resource={resource}
                    onVersionSelect={(version) =>
                        router.push({
                            pathname: `/resources/[id]/version/[version-id]`,
                            query: {id: resource._id, "version-id": version._id},
                        })
                    }
                />

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
