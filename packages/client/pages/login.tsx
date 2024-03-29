import Link from "next/link";
import {useRouter} from "next/router";
import React, {useState} from "react";
import {useRecoilState} from "recoil";
import styled from "styled-components";
import {userState} from "../atoms/user";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import PropsTheme from "../styles/theme/PropsTheme";
import getAxios, {buildAxios} from "../util/AxiosInstance";
import {setToken} from "../util/TokenManager";
import {validateEmail, validatePassword} from "../util/Validation";
import Head from "next/head";
import { teamState } from "../atoms/team";
import { PersonalUser } from "@savagelabs/types";
import { useEffect } from "react";
import useToast from "../util/hooks/useToast";

export default function Login() {

    const [user, setUser] = useRecoilState(userState);

    const [teams, setTeams] = useRecoilState(teamState);

    const router = useRouter();

    const [submitting, setSubmitting] = useState(false);

    const toast = useToast();

    useEffect(() => {
        if (!user) return;
        toast("You are already logged in!")
        router.push("/")
    }, [user])


    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [err, setErr] = useState("");

    const login = () => {
        if (!validateEmail(email) || !validatePassword(password)) {
            setErr("invalid email or password.")
            return;
        }
        setErr("")
        getAxios()
            .post("/auth/login", {
                email: email,
                password,
            })
            .then((res) => {
                setSubmitting(false)
                setToken(res.data.payload.token)
                setUser(res.data.payload.user)
                buildAxios()
                fetchTeam(res.data.payload.user)
            })
            .catch((err) => {
              setErr(err.response.data.error)
            });
    };

    const fetchTeam = (user: PersonalUser) => {
        getAxios().get("/directory/team/by-member/" + user._id).then(res => {
          if (res.data.payload.team !== null) {
            setTeams(res.data.payload.team)
            console.log("fetched and set team atom.")
          } else {
            setTeams([])
            console.log("not a team member.")
          }
          router.push("/")

        })
      }

    return (
        <>
            <Head>
                <title>Login - Marketplace</title>
                <meta name="description" content="Login"/>
            </Head>
            <Wrapper>
                <LoginContainer>
                    <Header>Log in</Header>
                    <Link href={"/signup"}>
                        <p>
                            Don't have an account yet?
                            <CreateAccountLink>Create an account</CreateAccountLink>
                        </p>
                    </Link>
                    <ErrorText>{err}</ErrorText>
                    <InputContainer>
                        <InputDivider>
                            <label>EMAIL ADDRESS</label>
                            <Input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                type="text"
                                placeholder={"Enter your email address"}
                                invalid={!validateEmail(email)}
                            />
                        </InputDivider>
                        <InputDivider>
                            <label>PASSWORD</label>
                            <Input
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                type="password"
                                placeholder={"Enter your password"}
                                invalid={!validatePassword(password)}
                            />
                        </InputDivider>
                        <InputDivider>
                            <ButtonWrapper>
                                <LoginButton
                                    type={"submit"}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        login();
                                    }}
                                >
                                    Log in
                                </LoginButton>
                            </ButtonWrapper>
                        </InputDivider>
                    </InputContainer>
                </LoginContainer>
            </Wrapper>
        </>
    );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  /* max-width: 400px; */
  width: 100%;
  margin: 1em;
`;

const Header = styled.h1`
  font-size: 56px;
`;

const LoginContainer = styled.form`
  display: flex;
  flex-direction: column;
  padding: 2em;
  margin: 1em;
  max-width: 500px;
`;

const CreateAccountLink = styled.span`
  cursor: pointer;
  color: ${(props: PropsTheme) => props.theme.accentColor};
  padding: 0 5px;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1em 0;
`;

const InputDivider = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 0.5em 0;
`;
const ButtonWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`
const LoginButton = styled(Button)`
  width: 75%;
  color: ${(props: PropsTheme) => props.theme.accentColor} !important;
  box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.18);
  padding: 12px !important;

  transition: 500ms ease-in-out;
  &:hover {
    color: ${(props: PropsTheme) => props.theme.secondaryAccentColor} !important;
  }
`;

const ErrorText = styled.p`
  color: ${(props: PropsTheme) => props.theme.errorColor};
`