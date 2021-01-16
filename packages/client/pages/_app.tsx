import styled, { ThemeProvider, useTheme } from "styled-components";
import Navbar from "./../components/ui/Navbar";
import GlobalStyle from "../styles/GlobalStyle";
import { RecoilRoot } from "recoil";
import { useRecoilValue } from "recoil";
import { themeState } from "../atoms/theme";
import Footer from "../components/ui/Footer";
import { useRecoilState } from "recoil";
import { userState } from "../atoms/user";
import { useEffect } from "react";
import getToken, { setToken } from "../util/TokenManager";
import getAxios from "../util/AxiosInstance";

function MyApp({ Component, pageProps }) {
  return (
    <Wrapper>
      <RecoilRoot>
        <WrappedApp Component={Component} pageProps={pageProps} />
      </RecoilRoot>
    </Wrapper>
  );
}

function WrappedApp({ Component, pageProps }) {
  const theme = useRecoilValue(themeState);
  const [user, setUser] = useRecoilState(userState);

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
        console.log("successfully logged in using localstorage token.");
      })
      .catch((err) => {
        if (err.response.data.error === "token is invalid") {
          setToken("");
          console.log("token was invalid.");
        }
      });
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <PageContainer>
        <Navbar />
        <Component {...pageProps} />
        <Footer />
      </PageContainer>
    </ThemeProvider>
  );
}

const PageContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 1280px;
`;

const Wrapper = styled.div`
  width: 100vw;

  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

export default MyApp;
