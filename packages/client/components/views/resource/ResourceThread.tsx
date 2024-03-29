import styled from "styled-components";
import PropsTheme from "../../../styles/theme/PropsTheme";
import {Resource} from "@savagelabs/types";
import parser from "../../../util/parser/Parser";


export default function ResourceThread(props: {
    resource: Resource | undefined;
}) {

    return <Wrapper>{parser.toReact(props.resource?.thread ? props.resource?.thread : "")}</Wrapper>;
}

const Wrapper = styled.div`
  padding: 1em;
  margin: 1em 0;
  border: 1px solid ${(props: PropsTheme) => props.theme.borderColor};
  border-radius: 4px;

  img {
    max-width: 100%;
  }

  word-break: break-all;

  * > img {
    max-width: 100%;
  }
`;
