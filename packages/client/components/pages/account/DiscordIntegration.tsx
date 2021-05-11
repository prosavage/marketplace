import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { themeState } from "../../../atoms/theme";
import { userState } from "../../../atoms/user";
import DarkTheme from "../../../styles/theme/DarkTheme";
import Input from "../../ui/Input";

export default function DiscordIntegration() {
  const user = useRecoilValue(userState);

  useEffect(() => {
    setServerID(user.discordServerId);
  }, [user]);

  const [serverID, setServerID] = useState(0);

  const theme = useRecoilValue(themeState);
  return (
    <Wrapper>
      <p>Resource based discord server integration.</p>
      <p>Make sure to enable widget in server settings.</p>
      <ServerIDInput>
        <p>Server ID:</p>
        <Input
          invalid={serverID === 0}
          value={serverID}
          onChange={(e) => setServerID(Number.parseInt(e.target.value))}
        />
      </ServerIDInput>
      <object
        key={serverID}
        style={{ marginTop: "1em" }}
        data={`https://discord.com/widget?id=${serverID}&theme=${
          theme === DarkTheme ? "dark" : "light"
        }`}
        width="100%"
        height="500"
      />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 1em 0;
`;

const ServerIDInput = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 0.5em 0;
`;
