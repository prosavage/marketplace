import React from "react";
import styled from "styled-components";
import PropsTheme from "../../../styles/theme/PropsTheme";
import {Resource, Team} from "@savagelabs/types";
import {Version} from "@savagelabs/types";
import renderReviewDroplets from "../../../util/Review";
import {useRecoilValue} from "recoil";
import {themeState} from "../../../atoms/theme";
import ResourceWidget, {PluginInfoRow} from "./ResourceWidget";
import timeago from "time-ago";
import Link from "next/link";

export default function PluginInfo(props: {
    team: Team | undefined;
    resource: Resource | undefined;
    firstVersion: Version | undefined;
}) {
    const theme = useRecoilValue(themeState);

    return (
        <ResourceWidget header={"PLUGIN INFO"}>
            <PluginInfoRow>
                <p>Author:</p>{" "}
                <Link href={`/users/[id]`} as={`/users/${props.team?._id}`}>
                    <AuthorLink>{props.team?.name}</AuthorLink>
                </Link>
            </PluginInfoRow>
            <PluginInfoRow>
                <p>Downloads:</p>
                <p>{new Intl.NumberFormat().format(props.resource?.downloads)}</p>
            </PluginInfoRow>
            <PluginInfoRow>
                <p>Released:</p>
                <p>{timeago.ago(props.firstVersion?.timestamp)}</p>
            </PluginInfoRow>
            <PluginInfoRow>
                <p>Updated:</p>
                <p>{timeago.ago(props.resource?.updated)}</p>
            </PluginInfoRow>
            <PluginInfoRow>
                <p>Rating:</p>
                <DropletsContainer>{renderReviewDroplets(theme, props.resource?.rating)}</DropletsContainer>
            </PluginInfoRow>
        </ResourceWidget>
    );
}

const DropletsContainer = styled.div`
  display: flex;
  align-items: center;
`;

const AuthorLink = styled.p`
  color: ${(props: PropsTheme) => props.theme.secondaryAccentColor};
  cursor: pointer;
`;
