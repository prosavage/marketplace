import { useRecoilValue } from "recoil";
import { themeState } from "../../../styles/atoms/theme";
import DarkTheme from "../../../styles/theme/DarkTheme";
import ResourceWidget from "./ResourceWidget";

export default function DiscordInfo(props: { discordServerId: number | undefined }) {

    const theme = useRecoilValue(themeState);

  return (
    <ResourceWidget header={"PLUGIN SUPPORT"}>
      <p>Join this author's Discord for support with their plugin(s).</p>
      <iframe
        style={{margin: "0.5em 0"}}
        src={`https://discord.com/widget?id=${props.discordServerId}&theme=${theme === DarkTheme ? "dark" : "light"}`}
        width="350"
        height="500"
        allowTransparency={true}
        frameBorder={0}
        sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
      />
    </ResourceWidget>
  );
}
