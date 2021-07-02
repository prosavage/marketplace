import Link from "next/link";
import React, { ReactFragment } from "react"
import { Info, Users, DollarSign } from "react-feather";
import styled from "styled-components";
import PropsTheme from "../../../../styles/theme/PropsTheme";
import { FlexCol, FlexRow } from "../../../ui/FlexRow";
import { Box } from "../../../ui/layout/Box";
interface AccountViewParentProps {
    content: () => ReactFragment
}

const links = [
    {name: "Profile", icon: <Info/>, href: "/"},
    {name: "Invites", icon: <Users/>, href: "/invites"},
    {name: "Stripe", icon: <DollarSign/>,href: "/stripe"}
]
 
export const AccountViewParent: React.FC<AccountViewParentProps> = ({content}) => {
        return (
            <Wrapper>
                <Sidebar>
                    {links.map(link => 
                        <Link href={"/account" + link.href}>
                            <SidebarEntry>
                                <SidebarIcon>
                                {link.icon}
                                    </SidebarIcon> {link.name}
                            </SidebarEntry>
                        </Link>
                    )}
                </Sidebar>
                <Content>
                    {content()}
                </Content>
            </Wrapper>
        );
}


const Wrapper = styled(FlexRow)`
    width: 100%;
    padding: 1em;

    @media(max-width: 800px) {
        flex-direction: column;
    }
`

const SidebarEntry = styled.div`
    padding: 0.5em;
    cursor: pointer;
    display: flex;
    flex-direction: row;;

    transition: 150ms ease-in-out;

    &:hover {
        color: ${(props: PropsTheme) => props.theme.accentColor};
    }
`

const Sidebar = styled(FlexCol)`
    width: 20%;
    max-width: 150px;
    border-right: 1px solid ${(props: PropsTheme) => props.theme.borderColor};

    @media(max-width: 800px) {
        width: 100%;
        max-width: 100%;
        flex-direction: row;
        flex-wrap: wrap;
    }
`

const Content = styled(FlexCol)`
    width: 80%;
    min-width: 650px;
    padding: 0 1em;

    @media(max-width: 800px) {
        width: 100%;
        min-width: 100%;
        
    }
`

const SidebarIcon = styled.div`
    display: flex;
    padding-right: 0.5em;
`