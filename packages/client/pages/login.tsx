import Link from "next/link";
import React, { useState } from "react";
import styled from "styled-components";
import Input from "../components/ui/Input";
import SecondaryButton from "../components/ui/Secondarybutton";
import PropsTheme from "../styles/theme/PropsTheme";
import { validatePassword, validateUsername } from "../util/Validation";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <Wrapper>
      <LoginContainer>
        <Header>Log in</Header>
        <Link href={"/signup"}>
          <p>
            Don't have an account yet?
            <CreateAccountLink>Create an account</CreateAccountLink>
          </p>
        </Link>
        <InputContainer>
          <InputDivider>
            <label>USERNAME OR EMAIL ADDRESS</label>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              type="text"
              placeholder={"Enter an email address"}
              invalid={!validateUsername(username)}
            />
          </InputDivider>
          <InputDivider>
            <label>PASSWORD</label>
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder={"Enter an email address"}
              invalid={!validatePassword(password)}
            />
          </InputDivider>
          <InputDivider>
            <SecondaryButton>Log in</SecondaryButton>
          </InputDivider>
        </InputContainer>
      </LoginContainer>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  /* max-width: 400px; */
  width: 100%;
  margin: 1em;
`;

const Grid = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
`;

const Header = styled.h1`
  font-size: 56px;
`;

const LoginContainer = styled.div`
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
