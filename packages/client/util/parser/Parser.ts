import parser from "bbcode-to-react";
import BreakTag from "./BreakTag";
import CenterTag from "./CenterTag";
import DarkTag from "./DarkTag";
import ImageTag from "./ImageTag";
import IndentTag from "./IndentTag";
import LeftTag from "./LeftTag";
import LightTag from "./LightTag";
import LinkTag from "./LinkTag";
import QuoteTag from "./QuoteTag";
import MediaTag from "./MediaTag";

parser.registerTag("quote", QuoteTag);
parser.registerTag("left", LeftTag);
parser.registerTag("br", BreakTag);
parser.registerTag("dark", DarkTag);
parser.registerTag("light", LightTag);
parser.registerTag("indent", IndentTag);
parser.registerTag("img", ImageTag);
parser.registerTag("center", CenterTag);
parser.registerTag("url", LinkTag);
parser.registerTag("media", MediaTag)
export default parser;
