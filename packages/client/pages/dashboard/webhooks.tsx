import React from "react";
import styled from "styled-components";
import DashboardNavbar from "../../components/pages/dashboard/DashboardNavbar";
import { WebhookList } from "../../components/pages/dashboard/webhooks/WebhookList";

export default function Webhooks() {

    


    return <>
        <DashboardNavbar/>
        <Wrapper>
            <h1>Webhooks</h1>
            <WebhookList/>
        </Wrapper>
    </>
}

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 1em;
`