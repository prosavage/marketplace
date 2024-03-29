import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { RecoilRoot, useRecoilState } from "recoil";
import styled, { ThemeProvider } from "styled-components";
import { PersonalUser } from "../../types";
import { teamState } from "../atoms/team";
import { themeState } from "../atoms/theme";
import { userState } from "../atoms/user";
import Footer from "../components/ui/Footer";
import NextNProgress from "../components/ui/NextNProgress";
import GlobalStyle from "../styles/GlobalStyle";
import getAxios, { buildAxios } from "../util/AxiosInstance";
import useStoredTheme from "../util/hooks/useStoredTheme";
import getToken, { setToken } from "../util/TokenManager";
import Navbar from "./../components/ui/Navbar";
import { NextWebVitalsMetric } from "next/app";

function MyApp({ Component, pageProps }) {
  return (
    <Wrapper>
      <RecoilRoot>
          <WrappedApp Component={Component} pageProps={pageProps} />
      </RecoilRoot>
    </Wrapper>
  );
}

export function reportWebVitals(metric: NextWebVitalsMetric) { }

function WrappedApp({ Component, pageProps }) {
  const [theme, setTheme] = useRecoilState(themeState);
  const [storedTheme, setStoredTheme] = useStoredTheme();
  const [user, setUser] = useRecoilState(userState);
  const [team, setTeam] = useRecoilState(teamState);

  useEffect(() => {
    setTheme(storedTheme);
  }, [storedTheme]);

  const router = useRouter();

  const fetchTeam = (user: PersonalUser) => {
    getAxios().get("/directory/team/by-member/" + user._id).then(res => {
      if (res.data.payload.team !== null) {
        setTeam(res.data.payload.team)
        console.log("fetched and set team atom.")
      } else {
        setTeam([])
        console.log("not a team member.")
      }
    })
  }

  useEffect(() => {
    if (user) {
      console.log("user is already logged in.");
      return;
    }
    const token = getToken();
    if (!token) {
      console.log("token not found...");
      return;
    }

    getAxios()
      .post("/auth/validate", {
        token,
      })
      .then((res) => {
        setUser(res.data.payload.user);
        buildAxios();
        console.log("successfully logged in using localstorage token.");
        fetchTeam(res.data.payload.user)
      })
      .catch((err) => {
        if (err.response.data.errors) {
          // if this exists the token is bad/malformed or edited.
          setToken("");
          console.log("token was malformed, or edited, resetting...");
        }
        if (err.response.data.error === "token is invalid") {
          setToken("");
          console.log("token was invalid.");
        }
      });
  }, []);

  return (
    <>
      <Head>
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <title>Marketplace</title>
      </Head>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <NextNProgress
          color={theme.accentColor}
          startPosition={0.3}
          stopDelayMs={10}
          height={3}
        />
        <PageContainer>
          <Navbar />
          <Component {...pageProps} />
          <Footer />

        </PageContainer>
        <ToastContainer position={"bottom-right"} />
      </ThemeProvider>
    </>
  );
}

const PageContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 1280px;
  min-height: 100vh;
`;

const Wrapper = styled.div`
  width: 100vw;

  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

export default MyApp;
