import {useRouter} from "next/router";
import React, {ReactFragment, useEffect, useState} from "react";
import {ArrowLeft} from "react-feather";
import {useRecoilValue} from "recoil";
import styled, {css} from "styled-components";
import {userState} from "../../../atoms/user";
import PropsTheme from "../../../styles/theme/PropsTheme";
import {Category, Resource, Role, Team, Version} from "@savagelabs/types";
import Button from "../../ui/Button";
import DiscordInfo from "./DiscordInfo";
import PluginInfo from "./PluginInfo";
import ResourceHeader from "./ResourceHeader";
import ResourceRating from "./ResourceRating";
import getAxios from "../../../util/AxiosInstance";
import {teamState} from "../../../atoms/team";

const resourceViews = [
    {label: "overview", href: "", owner: false, staff: false},
    {label: "versions", href: "versions", owner: false, staff: false},
    {label: "update", href: "update", owner: true, staff: false},
    {label: "icon", href: "icon", owner: true, staff: false},
    {label: "edit", href: "edit", owner: true, staff: false},
    {label: "admin", href: "admin", owner: false, staff: true},
    {label: "webhook", href: "webhook", owner: true, staff: false}
];

export default function ResourceId({
                                       resourceId,
                                       content,
                                       staffOnly = false
                                   }: {
    resourceId: string;
    staffOnly?: boolean;
    content: (resource: Resource, team: Team, versions: Version[], category: Category) => React.ReactNode
}) {
    const router = useRouter();

    const myTeams = useRecoilValue(teamState);

    const user = useRecoilValue(userState);

    // For general resource info.
    const [resource, setResource] = useState<Resource>();
    // For versions page and browser.
    const [versions, setVersions] = useState<Version[]>([]);
    // Author info for sidebar, and ownership purposes.
    const [team, setTeam] = useState<Team>();
    // Category for pushing back button.
    const [category, setCategory] = useState<Category>();


    useEffect(() => {
        getAxios()
            .get(`/resources/${resourceId}`)
            .then((res) => setResource(res.data.payload.resource));
        getAxios()
            .get(`/directory/versions/resource/${resourceId}/1`)
            .then((res) => {
                setVersions(res.data.payload.versions);
            });
    }, []);


    useEffect(() => {
        if (!resource) return;
        let viewname = router.route.split("/[id]/")[1];
        if (!viewname) {
            viewname = ""
        }

        router.push(
            router.route,
            `/resources/${resource._id}.${resource.slug}/${viewname}`,
            {shallow: true}
        );

        getAxios()
            .get(`/team/${resource.owner}`)
            .then((res) => setTeam(res.data.payload.team));

        getAxios()
            .get(`/category/${resource.category}`)
            .then((res) => setCategory(res.data.payload.category))
            .catch((err) => console.log(err.response.data));
    }, [resource]);

    useEffect(() => {
        // only use on restricted pages.
        if (!staffOnly) return;
        // redirects if not admin...
        // undefined means not logged in.
        if (!user || !resource) return;

        // gotta redirect.
        if (user.role !== Role.USER) return;

        router.push(
            "/resources/[id]/",
            `/resources/${resource._id}.${resource.slug}/`
        );
    }, [user, resource]);

    const viewerOwnsResource = () => {
        // both can be undefined if loading, and return true, causing a flicker.
        if (!resource || !user) return false;
        if (user.role !== Role.USER) return true;



        return myTeams?.map(team => team._id).includes(resource.owner)
    };

    const viewerIsStaff = () => {
        if (!resource || !user) return false;
        if (user.role !== Role.USER) return true;
    };

    const getFirstVersion = () => {
        return versions[versions.length - 1];
    };

    const renderViewController = () => {
        return (
            <ViewController>
                {resourceViews
                    .filter((entry) => !(!viewerOwnsResource() && entry.owner))
                    .filter((entry) => !(!viewerIsStaff() && entry.staff))
                    .map((entry) => (
                        <ViewEntry
                            key={entry.label}
                            //   selected={view === viewEntry.toLowerCase()}
                            selected={undefined}
                            onClick={() =>
                                router.push(`/resources/${resource._id}/${entry.href}`)
                            }
                        >
                            {entry.label.toUpperCase()}
                        </ViewEntry>
                    ))}
            </ViewController>
        );
    };

    return (
        <Wrapper>
            <div>
                <BackButton
                    onClick={() => {
                        router.push(`/directory/resources/${category.type}`);
                    }}
                >
                    <BackArrow size={"15px"}/> <ButtonText>Return to plugins</ButtonText>
                </BackButton>
            </div>
            <ResourceContentContainer>
                <ResourceBody>
                    <ResourceHeader
                        resource={resource}
                        version={versions[0]}
                        onVersionPress={() => {
                            router.push(`/resources/${resource._id}/versions`);
                        }}
                    />
                    {renderViewController()}
                    {content(resource, team, versions, category)}
                    <ResourceRating resource={resource}/>
                </ResourceBody>
                <MetadataContainer>
                    <PluginInfo
                        team={team}
                        resource={resource}
                        firstVersion={getFirstVersion()}
                    />
                    <DiscordInfo discordServerId={team?.discordServerId}/>
                </MetadataContainer>
            </ResourceContentContainer>
        </Wrapper>
    );
}

export async function getServerSideProps({params}) {
    const id = params.id as string;

    return {props: {id}};
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 2em;

  }
`;

const BackButton = styled(Button)`
  width: auto;
  padding: 12px 20px !important;
  color: black !important;
  background: ${(props: PropsTheme) => props.theme.accentColor} !important;
  box-shadow: none;

  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const BackArrow = styled(ArrowLeft)`
  color: ${(props: PropsTheme) => props.theme.oppositeColor};
`;

const ButtonText = styled.p`
  margin: 0 0.5em;
  color: ${(props: PropsTheme) => props.theme.oppositeColor};
`;

const ResourceContentContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  margin: 2em 0;

  @media (max-width: 1000px) {
    flex-direction: column;

  }
`;

const ResourceBody = styled.div`
  display: flex;
  flex-direction: column;
  flex-basis: 70%;

  
`;

const MetadataContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-basis: 30%;
  /* margin: 0 1em; */

  @media(min-width: 1000px) {
      margin: 0 1em;
  }
`;

const ViewController = styled.div`
  display: flex;
  flex-direction: row;
  padding: 1em;
  margin-top: 1em;
  border: 1px solid ${(props: PropsTheme) => props.theme.borderColor};
  border-radius: 4px;

  @media(max-width: 600px) {
      flex-wrap: wrap;
  }
`;

const ViewEntry = styled.p`
  padding: 0 0.5em;
  transition: 250ms ease-in-out;
  cursor: pointer;

  ${(props: { selected: boolean | undefined }) =>
          props.selected &&
          css`
            color: ${(props: PropsTheme) => props.theme.secondaryAccentColor};
          `}
  &:hover {
    color: ${(props: PropsTheme) => props.theme.secondaryAccentColor};
  }
`;
