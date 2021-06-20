import NProgress from "nprogress";
import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { themeState } from "../../../atoms/theme";
import { userState } from "../../../atoms/user";
import DarkTheme from "../../../styles/theme/DarkTheme";
import getAxios from "../../../util/AxiosInstance";
import useToast from "../../../util/hooks/useToast";
import Button from "../../ui/Button";
import Input from "../../ui/Input";

export default function DiscordIntegration() {
  const user = useRecoilValue(userState);

  const toast = useToast();

  const setDiscordServer = () => {
    NProgress.start();
    getAxios()
      .post("/team/settings/discord-server", {
        serverID,
      })
      .then((res) => {
        NProgress.done();
        toast("Set discord server id: " + res.data.payload.serverID);
      });
  };

  useEffect(() => {
    setServerID(user?.discordServerId + "");
  }, [user]);

  const [serverID, setServerID] = useState("");

  const theme = useRecoilValue(themeState);
  return (
    <Wrapper>
      <p>Resource based discord server integration.</p>
      <p>Make sure to enable widget in server settings.</p>
      <ServerIDInput>
        <p>Server ID:</p>
        <Input
          invalid={serverID.length === 0}
          value={serverID}
          onChange={(e) => setServerID(e.target.value)}
        />
      </ServerIDInput>
      <Button onClick={setDiscordServer}>Set Discord Server</Button>
      <object
        key={serverID}
        style={{ marginTop: "1em" }}
        data={`https://discord.com/widget?id=${serverID}&theme=${
          theme === DarkTheme ? "dark" : "light"
        }`}
        width="100%"
        height="350"
      />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 1em 0;
  max-width: 400px;
`;

const ServerIDInput = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 0.5em 0;
`;
