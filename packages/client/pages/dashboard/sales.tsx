import React from "react";
import styled from "styled-components";
import DashboardNavbar from "../../components/pages/dashboard/DashboardNavbar";
import Head from "next/head";

export default function Sales() {
    return <>
        <Head>
            <title>Sales - Dashboard</title>
            <meta name="description" content="Webhooks Dashboard" />
        </Head>
        <DashboardNavbar/>
        <Wrapper>
            <h1>Sales</h1>
        </Wrapper>
    </>
}

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 1em 0;
`