import { highlight, languages } from "prismjs";
import React, { useState } from "react";
import { Maximize2, Minimize2 } from "react-feather";
import Editor from "react-simple-code-editor";
import styled from "styled-components";
import PropsTheme from "../../../styles/theme/PropsTheme";
import parser from "../../../util/parser/Parser";

enum MaximizedState {
  NONE = "NONE",
  EDITOR = "EDITOR",
  PREVIEW = "PREVIEW",
}

const BBCodeEditor = (props: {
  content: string;
  onChange: (newContent: string) => void;
}) => {
  const [maximized, setMaximized] = useState(MaximizedState.NONE);

  const showEditor = () => {
    return (
      maximized === MaximizedState.NONE || maximized === MaximizedState.EDITOR
    );
  };

  const showPreview = () => {
    return (
      maximized === MaximizedState.NONE || maximized === MaximizedState.PREVIEW
    );
  };

  return (
    <Wrapper>
      {showEditor() && (
        <Container>
          <Header>
            <label>EDITOR</label>
            {maximized === MaximizedState.NONE && (
              <Maximize2 onClick={() => setMaximized(MaximizedState.EDITOR)} />
            )}
            {maximized === MaximizedState.EDITOR && (
              <Minimize2 onClick={() => setMaximized(MaximizedState.NONE)} />
            )}
          </Header>
          <ThreadEditor
            value={props.content}
            onValueChange={(code) => {
              props.onChange(code);
            }}
            highlight={(code) => highlight(code, languages.bbcode, "bbcode")}
            padding={15}
            style={{
              fontFamily: '"Fira code", "Fira Mono", monospace',
              fontSize: 12,
            }}
          />
        </Container>
      )}

      {showPreview() && (
        <Container>
          <Header>
            <label>PREVIEW</label>
            {maximized === MaximizedState.NONE && (
              <Maximize2 onClick={() => setMaximized(MaximizedState.PREVIEW)} />
            )}
            {maximized === MaximizedState.PREVIEW && (
              <Minimize2 onClick={() => setMaximized(MaximizedState.NONE)} />
            )}
          </Header>
          <ThreadContainer>{parser.toReact(props.content)}</ThreadContainer>
        </Container>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  @media (max-width: 700px) {
    flex-direction: column;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 0.5em;
`;

const EditorContainer = styled(Container)`
  margin-right: 0.5em;
`;

const PreviewContainer = styled(Container)`
  margin-left: 0.5em;
`;

const Header = styled.div`
  display: flex;
  width: 100%;
  background: ${(props: PropsTheme) => props.theme.accentColor};
  border-radius: 4px 4px 0 0;
  padding: 0.5em;

  justify-content: space-between;
`;

const ThreadContainer = styled.div`
  padding: 1em;
  border-radius: 4px;
  border: 1px solid ${(props: PropsTheme) => props.theme.borderColor};

  img {
    max-width: 100%;
  }

  * > img {
    max-width: 100%;
  }
`;

const ThreadEditor = styled(Editor)`
  overflow-y: visible;
  min-height: 150px;
  background: ${(props: PropsTheme) => props.theme.backgroundSecondary};
  color: ${(props: PropsTheme) => props.theme.color};
  border: 1px solid ${(props: PropsTheme) => props.theme.borderColor};
`;

export default BBCodeEditor;

const defaultCode = `
[CENTER][IMG]https://i.imgur.com/yaf617t.png[/IMG][/CENTER]

[CENTER][SIZE=5][B][COLOR=#f72d40]WildInspect[/COLOR][/B] is an alternative for CoreProtect's inspect-mode. You can set required role for factions and it can be used only inside player's territories.[/SIZE][/CENTER]


[CENTER][IMG]https://i.imgur.com/BfLuwHO.gif[/IMG][IMG]https://i.imgur.com/ldttp9s.gif[/IMG][/CENTER]



[IMG]https://i.imgur.com/iQQB2qJ.png[/IMG]
[INDENT]
[SIZE=5]• This tool is the best snitching tool for your players![/SIZE]
[INDENT][SIZE=4]Are you also tired of players complaining about inside-raiders? Then just add the plugin to your server, it will hook into CoreProtect, and using a custom command your players will be able to know who stole their diamonds from their base (only if they kept it inside it tho...)[/SIZE][/INDENT]

[SIZE=5]• Your team can still be hidden![/SIZE]
[INDENT][SIZE=4]Don't worry about your staff team being shown on the radar of WildInspect - the plugin respects the ops and will hide them from the inspect mode![/SIZE][/INDENT]

[SIZE=5]• That's just overpowered.[/SIZE]
[INDENT][SIZE=4]I've got your back, don't worry. We nerfed the tool a bit so it can show only data from the recent days, or specific amount of pages... and of course, everything is configurable![/SIZE][/INDENT]

[SIZE=5]• Premium plugin at no cost![/SIZE]
[INDENT][SIZE=4]Until 1st January, 2021, WildInspect was a paid resource with more than 500 unique customers! Today, the same WildInspect plugin is free, with all the features included to make sure you get the best quality for no cost![/SIZE][/INDENT]

[SIZE=5]• The plugin is provided "as is".[/SIZE]
[INDENT][SIZE=4]Due to a busy schedule that I have IRL, I can't guarantee frequent updates. I will do my best to patch major issues. You can find dev builds with more patches and bug fixes on our [URL='https://hub.bg-software.com/job/WildInspect']Jenkins[/URL] page![/SIZE][/INDENT]
[/INDENT]


[CENTER][SIZE=5]You can read more about [B][COLOR=#f72d40]WildInspect[/COLOR][/B] on the wiki page!
[URL='https://bg-software.com/wildinspect']https://bg-software.com/wildinspect[/URL][/SIZE][/CENTER]



[CENTER][URL='https://www.spigotmc.org/resources/87406/'][IMG]https://i.imgur.com/t22CkX7.png[/IMG][/URL] [URL='https://www.spigotmc.org/resources/87404/'][IMG]https://i.imgur.com/BHVj4oU.png[/IMG][/URL] [URL='https://www.spigotmc.org/resources/87408/'][IMG]https://i.imgur.com/rpQgLwJ.png[/IMG][/URL]
[URL='https://www.spigotmc.org/resources/87409/'][IMG]https://i.imgur.com/ihjmaj7.png[/IMG][/URL] [URL='https://www.spigotmc.org/resources/87410/'][IMG]https://i.imgur.com/vRQB4A1.png[/IMG][/URL]
[URL='https://www.spigotmc.org/resources/87411/'][IMG]https://i.imgur.com/gbf17uR.png[/IMG][/URL][/CENTER]



[CENTER][URL='http://bg-software.com/discord'][IMG]https://i.imgur.com/6SEpbWv.png[/IMG][/URL][/CENTER]
`;
