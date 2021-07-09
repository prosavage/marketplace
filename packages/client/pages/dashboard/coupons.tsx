import React from "react";
import styled from "styled-components";
import DashboardNavbar from "../../components/views/dashboard/DashboardNavbar";

export default function Coupons() {
    return <>
        <DashboardNavbar/>
        <Wrapper>
            <h1>Coupons</h1>
        </Wrapper>
    </>
}

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 1em 0;
`