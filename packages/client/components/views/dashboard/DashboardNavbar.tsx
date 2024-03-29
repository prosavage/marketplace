import styled, { css } from "styled-components";
import { useEffect, useState } from "react";
import { Menu, X } from "react-feather";
import { useRecoilValue } from "recoil";
import ActiveLink from "../../ActiveLink";
import PropsTheme from "../../../styles/theme/PropsTheme";
import { useRouter } from "next/router";
import { userState } from "../../../atoms/user";

const links = [
  {
    link: "/dashboard",
    text: "Overview",
  },
  {
    link: "/dashboard/sales",
    text: "Sales",
  },
  {
    link: "/dashboard/coupons",
    text: "Coupons",
  },
  {
    link: "/dashboard/webhooks",
    text: "Webhooks",
  },
];

export default function SubNavbar(props) {
  const [toggled, setToggled] = useState(false);
  const [width, setWidth] = useState(0);

  const router = useRouter();

  const user = useRecoilValue(userState);

  const isDesktop = () => {
    return width > 700;
  };

  const isMobile = () => {
    return !isDesktop();
  };

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
  });

  const getLinks = () => {
    return links.map((entry) => (
      <LinkWrapper key={entry.link}>
        <ActiveLink href={entry.link}>
          <LinkText selected={window.location.pathname.startsWith(entry.link)}>
            {entry.text}
          </LinkText>
        </ActiveLink>
      </LinkWrapper>
    ));
  };

  return (
    <Wrapper>
      <Content>
        <LogoSection>
          <LogoText>Dashboard</LogoText>
          {!toggled && isDesktop() && <LinksWrapper>{getLinks()}</LinksWrapper>}
        </LogoSection>
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
  color: black;
  /* Want a line instead of shadow in dark mode. */
  background: ${(props: PropsTheme) => props.theme.accentColor};
  /* Box shadow for light mode. */
`;

const LogoText = styled.p`
  font-size: 20px;
  font-weight: bold;
  color: ${(props: PropsTheme) => props.theme.oppositeColor};
`;

const Content = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0.5em 0.5em;
  justify-content: space-between;

  @media (min-width: 700px) {
    justify-content: space-between;
    flex-direction: row;
  }
`;

const LogoSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 15px;

  @media (min-width: 700px) {
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
  flex-direction: column;
  justify-content: center;
  width: 100%;
  padding: 0 15px;

  @media (min-width: 700px) {
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: auto;
  }
`;

const LinkText = styled.p`
  font-size: 1rem;
  cursor: pointer;
  font-weight: 600;
  ${(props: { selected: boolean }) =>
    props.selected &&
    css`
      background: #00b2ff;
      border-radius: 5px;
    `};
  color: ${(props: PropsTheme) => props.theme.oppositeColor};
  @media (min-width: 700px) {
    padding: 0 15px;
  }
  &:hover {
    background: ${(props: PropsTheme) => props.theme.secondaryAccentColor};
    border-radius: 5px;
  }
`;
