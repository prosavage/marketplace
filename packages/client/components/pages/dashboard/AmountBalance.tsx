import styled from "styled-components"

export default function AmountBalance(props: {top: string, amount: string}) {
    return <Wrapper>
        <p>{props.top}</p>
        <Balance>{props.amount}</Balance>
    </Wrapper>
}

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
`

const Balance = styled.p`
    font-size: 30px;
`