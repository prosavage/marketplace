import React from "react";
import styled from "styled-components";
import SecondaryButton from "../components/ui/Secondarybutton";
import PropsTheme from "../styles/theme/PropsTheme";

export default function Login() {
  return (
    <Wrapper>
      <LoginContainer>
        <h1>Log in</h1>
        <p>
          Don't have an account yet?
          <CreateAccountLink>Create an account</CreateAccountLink>
        </p>
        <InputContainer>
          <InputDivider>
            <label>USERNAME OR EMAIL ADDRESS</label>
            <input type="text" placeholder={"Enter an email address"} />
          </InputDivider>
          <InputDivider>
            <label>PASSWORD</label>
            <input type="password" placeholder={"Enter an email address"} />
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
  flex-direction: row;
  justify-content: center;
  /* max-width: 400px; */
  width: 100%;
  margin: 1em;
`;

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1em;
  margin: 1em;
`;

const CreateAccountLink = styled.span`
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
