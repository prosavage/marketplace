import styled from "styled-components";
import PropsTheme from "../../styles/theme/PropsTheme";

const Button = styled.button`
  background: ${(props: PropsTheme) => props.theme.backgroundPrimary};
  color: ${(props: PropsTheme) => props.theme.color};
  font-weight: bold;
  padding: 10px;
  outline: none;
  border: 1px solid ${(props: PropsTheme) => props.theme.borderColor};
  border-radius: 4px;
  cursor: pointer;

  transition: 250ms ease-in-out;
  &:hover {
    border: 1px solid ${(props: PropsTheme) => props.theme.accentColor};
  }
`;

export default Button;
