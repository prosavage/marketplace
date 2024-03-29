import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, Moon, Sun, X } from "react-feather";
import { useRecoilState, useRecoilValue } from "recoil";
import styled from "styled-components";
import { teamState } from "../../atoms/team";
import { themeState } from "../../atoms/theme";
import { userState } from "../../atoms/user";
import DarkTheme from "../../styles/theme/DarkTheme";
import LightTheme from "../../styles/theme/LightTheme";
import PropsTheme from "../../styles/theme/PropsTheme";
import getAxios from "../../util/AxiosInstance";
import useStoredTheme from "../../util/hooks/useStoredTheme";
import ActiveLink from "./../ActiveLink";
import Button from "./Button";

const links = [
    {
        link: "/",
        text: "HOME",
        mobileOnly: false,
    },
    {
        link: "/directory/resources/plugin",
        text: "RESOURCES",
        mobileOnly: false,
    },
    {
        link: "/login",
        text: "LOG IN",
        mobileOnly: true,
    },
    {
        link: "/signup",
        text: "SIGN UP",
        mobileOnly: true,
    }
];

export default function Navbar(props) {
    const [theme, setTheme] = useRecoilState(themeState);
    const user = useRecoilValue(userState);

    const team = useRecoilValue(teamState);

    const [storedTheme, setStoredTheme] = useStoredTheme();

    const [toggled, setToggled] = useState(false);
    const [width, setWidth] = useState(0);

    const [isSeller, setSellerStatus] = useState(false)

    const isDesktop = () => {
        return width > 800;
    };

    const isMobile = () => {
        return !isDesktop();
    };

    const checkSellerStatus = () => {
        getAxios().get("/checkout/seller").then(res => setSellerStatus(res.data.payload.isSeller)).catch(err => console.log(err.response.data.error))
    }

    useEffect(() => {
        if (!user) return
        checkSellerStatus()
    }, [user])

    useEffect(() => {
        // function defined to update our width
        function updateWidth() {
            if (isDesktop()) setToggled(false);
            setWidth(window.innerWidth);
        }

        // bind it to the resize event
        window.addEventListener("resize", updateWidth);
        // our state has a 0 at beginning, so we need to run update once.
        updateWidth();
        return () => window.removeEventListener("resize", updateWidth);
    }, []);

    const getLinks = () => {
        const linksToUse = [...links]

        if (isSeller) {
            linksToUse.push({
                link: "/dashboard",
                text: "DASHBOARD",
                mobileOnly: false,
            })
        }

        if (team) {
            linksToUse.push({
                link: "/team",
                text: "TEAM",
                mobileOnly: false
            })
        }

        return linksToUse.map((entry) => {
            if (entry.mobileOnly && width > 500) return;
            return (
                <LinkWrapper key={entry.link}>
                    <ActiveLink href={entry.link}>
                        <LinkText>{entry.text}</LinkText>
                    </ActiveLink>
                </LinkWrapper>
            );
        });
    };




    return (
        <Wrapper>
            <Content>
                <LogoSection>
                    <Link href={"/"}>
                        <LogoText>Marketplace</LogoText>
                    </Link>
                    {!toggled && isDesktop() && <LinksWrapper>{getLinks()}</LinksWrapper>}
                </LogoSection>
                <AccountSection>
                    {user ? (
                        <LinkWrapper>
                            <ActiveLink href={"/account"}>
                                <AccountText>{user.username}</AccountText>
                            </ActiveLink>
                        </LinkWrapper>
                    ) : (
                        <AccountLoginSignUp>
                            <LinkWrapper>
                                <ActiveLink href={"/login"}>
                                    <AccountText>Log In</AccountText>
                                </ActiveLink>
                            </LinkWrapper>
                            <LinkWrapper>
                                <ActiveLink href={"/signup"}>
                                    <SignUpButton>Sign Up</SignUpButton>
                                </ActiveLink>
                            </LinkWrapper>
                        </AccountLoginSignUp>
                    )}

                    <LinkWrapper
                        style={{ paddingRight: "1em", cursor: "pointer" }}
                        onClick={() => {
                            setStoredTheme(theme === DarkTheme ? LightTheme : DarkTheme);
                            setTheme(theme === DarkTheme ? LightTheme : DarkTheme);
                        }}
                    >
                        {theme === DarkTheme ? <Moon /> : <Sun />}
                    </LinkWrapper>
                    {!toggled && !isDesktop() && (
                        <Menu
                            style={{
                                color: `${(props: PropsTheme) => props.theme.color}`,
                                cursor: "pointer",
                            }}
                            size="24px"
                            onClick={() => setToggled(!toggled)}
                        />
                    )}
                    {toggled && !isDesktop() && (
                        <X
                            style={{
                                color: `${(props: PropsTheme) => props.theme.color}`,
                                cursor: "pointer",
                            }}
                            size="24px"
                            onClick={() => setToggled(false)}
                        />
                    )}
                </AccountSection>
            </Content>
            {toggled && isMobile() && <div>{getLinks()}</div>}
        </Wrapper>
    );
}

const Wrapper = styled.div`
  width: 100vw;
  display: flex;
  flex-direction: column;
  /* This will basically push everything to left and right. */
  justify-content: center;
  align-items: center;

  /* Want a line instead of shadow in dark mode. */
  background: ${(props: PropsTheme) => props.theme.backgroundPrimary};
  border-bottom: 1px solid ${(props: PropsTheme) => props.theme.borderColor};
  /* Box shadow for light mode. */
`;

const LogoText = styled.p`
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
`;

const Content = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0.5em 0.5em;
  justify-content: space-between;

  @media (min-width: 800px) {
    justify-content: space-between;
    flex-direction: row;
  }
`;

const LogoSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 15px;

  @media (min-width: 800px) {
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: auto;
  }
`;

const LinkWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px 5px;
`;

const LinksWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
  padding: 0 15px;

  @media (min-width: 800px) {
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: auto;
  }
`;

const LinkText = styled.p`
  font-size: 1rem;
  cursor: pointer;

  @media (min-width: 800px) {
    padding: 0 15px;
  }

  &:hover {
    color: ${(props: PropsTheme) => props.theme.secondaryAccentColor};
  }
`;

const AccountSection = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 0 15px;
`;

const AccountText = styled.p`
  font-size: 1.1em;
  display: flex;
  justify-content: center;

  &:hover {
    color: ${(props: PropsTheme) => props.theme.secondaryAccentColor};
  }
`;

const SignUpButton = styled(Button)`
  background: ${(props: PropsTheme) => props.theme.oppositeColor} !important;
  color: ${(props: PropsTheme) => props.theme.accentColor} !important;
  box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.28);
  padding: 15px 20px !important;
  cursor: pointer;
`;

const AccountLoginSignUp = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 0 10px;

  @media (max-width: 500px) {
    display: none;
  }
`;
