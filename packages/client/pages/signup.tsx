import { useState } from "react";
import styled from "styled-components";
import Input from "../components/ui/Input";
import PropsTheme from "../styles/theme/PropsTheme";

export default function Signup(props) {

    const [email, setEmail] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")


  return (
    <Wrapper>
      <SignupContainer>
        <Header>Create account</Header>
        <p>
          Already have an account? <SignIn>Log in</SignIn>
        </p>
        <InputContainer>
          <label>EMAIL ADDRESS</label>
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="text"
            placeholder={"Enter an email address"}
            invalid={true}
          />
        </InputContainer>
        <InputContainer>
          <label>USERNAME</label>
          <input type="text" placeholder={"Enter a cool username"} />
        </InputContainer>
        <InputContainer>
          <label>PASSWORD</label>
          <input type="password" placeholder={"Enter a password"} />
        </InputContainer>
      </SignupContainer>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: center;
`;

const Header = styled.h1`
  font-size: 56px;
`;

const SignupContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const SignIn = styled.span`
  color: ${(props: PropsTheme) => props.theme.accentColor};
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 1em 0;
`;
