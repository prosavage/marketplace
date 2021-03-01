import React from "react";
import styled from "styled-components";
import DashboardNavbar from "../../components/pages/dashboard/DashboardNavbar";

export default function Sales() {
    return <>
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