import Head from "next/head";
import {useRouter} from "next/router";
import React from "react";
import ResourceVersions from "../../../components/views/resource/ResourceVersions";
import ResourceViewParent from "../../../components/views/resource/ResourceViewParent";

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
                            pathname: `/resources/${resource._id}/version/${version._id}`,
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
