import styled from "styled-components";
import { Resource } from "../../types/Resource";
import { getResourceIconURL } from "../../util/cdn";
import Image from "next/image";

export default function ResourceIcon(props: { resource: Resource, size: string }) {
    // https://marketplace-savagelabs.b-cdn.net/resources/5fe543e4617b45c9499e40d1/icon.png
    const fallback = "https://marketplace-savagelabs.b-cdn.net/defaults/default-icon.svg"
    return <ImageStyled src={getResourceIconURL(props.resource._id)} alt="" height={props.size} width={props.size}/>
}

const ImageStyled = styled(Image)`
    background-image: url("https://marketplace-savagelabs.b-cdn.net/defaults/default-icon.svg");
    border-radius: 4px;
`
