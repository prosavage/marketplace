import React from "react";
import styled from "styled-components";
import AmountBalance from "../../components/views/dashboard/AmountBalance";
import DashboardNavbar from "../../components/views/dashboard/DashboardNavbar";
import PayoutButton from "../../components/views/dashboard/PayoutButton";
import RecentPurchases from "../../components/views/dashboard/RecentPurchases";
import RecentSalesChart from "../../components/views/dashboard/RecentSalesChart";
import UserNameLink from "../../components/views/dashboard/UserNameLink";

export default function Dashboard() {
  return (
    <>
      <DashboardNavbar />
      <Wrapper>
        <Header>
          <UserNameLink />
          <Balance>
            <AmountBalance />
            <PayoutButton />
          </Balance>
        </Header>
        <RecentSalesChart />
        <RecentPurchases />
      </Wrapper>
    </>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1050px;
  padding: 1em;
`;

const Header = styled.div`
  padding: 2em 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  @media (max-width: 720px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const Balance = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  @media (max-width: 720px) {
    margin: 1em 0;
    flex-direction: column;
  }
`;
