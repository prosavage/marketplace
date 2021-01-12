import styled from "styled-components";
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

        </InputContainer>
      </LoginContainer>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  justify-content: center;
  width: 100%;
`;

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1em;
`;

const CreateAccountLink = styled.span`
  color: ${(props: PropsTheme) => props.theme.accentColor};
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1em 0;
`;
