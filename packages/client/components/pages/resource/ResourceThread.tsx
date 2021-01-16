import styled from "styled-components";
import PropsTheme from "../../../styles/theme/PropsTheme";
import { Resource } from "../../../types/Resource";
import parser from "bbcode-to-react";
import { useRecoilValue } from "recoil";
import { themeState } from "../../../atoms/theme";
import DarkTheme from "../../../styles/theme/DarkTheme";

export default function ResourceThread(props: {
  resource: Resource | undefined;
}) {

  const theme = useRecoilValue(themeState);

  const useThread = () => {
    const themeThread = theme === DarkTheme ? props.resource?.darkThread : props.resource?.thread;
    if (!themeThread) return ""
    return themeThread;
  }

  const thread = `[CENTER][IMG]https://savagelabs.b-cdn.net/threads/factionsx/FactionsX_Banner_Header.svg[/IMG] 
  [IMG]https://savagelabs.b-cdn.net/threads/factionsx/FactionsX-Features.svg[/IMG]
  [IMG]https://savagelabs.b-cdn.net/threads/factionsx/ConversionToolHeader.svg[/IMG]
  [/CENTER]
  [IMG]https://savagelabs.b-cdn.net/threads/factionsx/ConversionToolSplash.svg[/IMG]
  [CENTER]
  [URL='https://toolkit.savagelabs.net/tools/factionsx-converter'][IMG]https://savagelabs.b-cdn.net/threads/factionsx/ConversionButton.svg[/IMG][/URL]
  [URL='https://discord.gg/savagelabs'][IMG]https://savagelabs.b-cdn.net/threads/factionsx/discord-plug.svg[/IMG] [/URL]
  [URL='https://patreon.com/ProSavage'][IMG]https://savagelabs.b-cdn.net/threads/factionsx/Patreon-AD-Minimal.png[/IMG] [/URL][/CENTER]`

  return <Wrapper>{parser.toReact(useThread())}</Wrapper>;
}


const Wrapper = styled.div`
    padding: 1em;
    margin: 1em 0;
    border: 1px solid ${(props: PropsTheme) => props.theme.borderColor};
    border-radius: 4px;

    img {
      width: 100%;
    }

    * > img {
      width: 100%;
    }
`