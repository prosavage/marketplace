import React from "react";
import styled from "styled-components";
import AmountBalance from "../../components/pages/dashboard/AmountBalance";
import DashboardNavbar from "../../components/pages/dashboard/DashboardNavbar";
import PayoutButton from "../../components/pages/dashboard/PayoutButton";
import RecentPurchases from "../../components/pages/dashboard/RecentPurchases";
import RecentSalesChart from "../../components/pages/dashboard/RecentSalesChart";
import UserNameLink from "../../components/pages/dashboard/UserNameLink";
import Head from "next/head";

export default function Dashboard() {
  return (
    <>
      <Head>
          <title>Dashboard - Marketplace</title>
          <meta name="description" content="Dashboard" />
      </Head>
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
