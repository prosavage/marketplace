import styled, {css} from "styled-components";

const Input = styled.input`
  transition: 250ms ease-in-out !important;
  ${(props: { invalid: boolean }) => props.invalid && css`
      border-bottom: 4px solid red;
    `}
`

export default Input;