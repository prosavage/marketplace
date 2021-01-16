import { useRecoilValue } from "recoil";
import { themeState } from "../../../atoms/theme";
import DarkTheme from "../../../styles/theme/DarkTheme";
import ResourceWidget from "./ResourceWidget";

export default function DiscordInfo(props: { discordServerId: number | undefined }) {

    const theme = useRecoilValue(themeState);

  return (
    <ResourceWidget header={"PLUGIN SUPPORT"}>
      <p>Join this author's Discord for support with their plugin(s).</p>
      <object
        key={props.discordServerId}
        style={{marginTop: "1em"}}
        data={`https://discord.com/widget?id=${props.discordServerId}&theme=${theme === DarkTheme ? "dark" : "light"}`}
        width="100%"
        height="500"
      />
    </ResourceWidget>
  );
}
