import { Resource } from "../../../types/Resource";
import ResourceWidget from "./ResourceWidget";

export default function ResourceEdit(props: {resource: Resource}) {
    return <ResourceWidget header={"RESOURCE EDIT"}>
        <p>EDIT RESOURCE</p>
        <p>EDIT RESOURCE ICON</p>
    </ResourceWidget>
}

