import React from "react";
import styled from "styled-components";
import Button from "../../ui/Button";

export default function PayoutButton() {
  return (
    <Wrapper>
      <PayButton>
        <h3>Payout Now</h3>
      </PayButton>
      <p>You receieve payouts daily.</p>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-left: 5em;
  @media (max-width: 720px) {
    padding-left: 0;
  }
`;

const PayButton = styled(Button)`
  padding: 15px !important;
  width: 100%;
  margin-bottom: 0.2em;
`;
