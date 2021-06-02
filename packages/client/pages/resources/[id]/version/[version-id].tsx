import {Version} from "@savagelabs/types";
import React, {useEffect, useState} from "react";
import ResourceVersionEntry from "../../../../components/pages/resource/ResourceVersionEntry";
import ResourceViewParent from "../../../../components/pages/resource/ResourceViewParent";
import getAxios from "../../../../util/AxiosInstance";

export default function ResourceId(props: { id: string; versionId: string }) {
    // For specific version rendering, when we just want to show one version's info.
    const [specificVersion, setSpecificVersion] = useState<Version>();


    useEffect(() => {
        const axios = getAxios();

        axios
            .get(`/version/${props.versionId}`)
            .then((res) => setSpecificVersion(res.data.payload))
            .catch((err) => console.log(err.response.data));
    }, []);

    return (
        <ResourceViewParent
            resourceId={props.id}
            content={resource => <>
                <ResourceVersionEntry
                    resource={resource}
                    version={specificVersion}
                    onVersionSelect={() => {
                    }}
                />
            </>
            }/>
    );
}

export async function getServerSideProps({
    params
}
)
{
    const id = params.id as string;
    const versionId = params["version-id"] as string;
    return {props: {id, versionId}};
}
