import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { userState } from "../../../atoms/user";
import PropsTheme from "../../../styles/theme/PropsTheme";
import getAxios from "../../../util/AxiosInstance";
import RecentPurchasesEntry from "./RecentPurchasesEntry";

export default function RecentPurchases() {
  const [payments, setPayments] = useState([]);

  const user = useRecoilValue(userState);

  useEffect(() => {
    getAxios()
      .get(`/checkout/purchases/1`)
      .then((res) => {
        setPayments(res.data.payload.payments);
      });
  }, []);

  const renderPayments = () => {
    if (payments.length > 0) {
      return payments.map((payment) => (
        <RecentPurchasesEntry key={payment._id} purchase={payment} />
      ));
    } else {
      return (
        <Container>
          <p>No sales found.</p>
        </Container>
      );
    }
  };

  return (
    <Wrapper>
      <Header>
        <p>Recent Sales</p>
      </Header>
      {renderPayments()}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  border: 1px solid ${(props: PropsTheme) => props.theme.borderColor};
  border-radius: 5px;
  overflow: hidden;
  margin-bottom: 2em;
`;

const Header = styled.div`
  padding: 0.5em 0.5em;
  background: ${(props: PropsTheme) => props.theme.accentColor};
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  margin: 0.5em;
`;
