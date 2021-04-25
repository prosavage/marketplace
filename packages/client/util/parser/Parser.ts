import parser from "bbcode-to-react";
import BreakTag from "./BreakTag";
import DarkTag from "./DarkTag";
import ImageTag from "./ImageTag";
import IndentTag from "./IndentTag";
import LeftTag from "./LeftTag";
import LightTag from "./LightTag";
import LinkTag from "./LinkTag";
import QuoteTag from "./QuoteTag";

parser.registerTag("quote", QuoteTag);
parser.registerTag("left", LeftTag);
parser.registerTag("br", BreakTag);
parser.registerTag("dark", DarkTag);
parser.registerTag("light", LightTag);
parser.registerTag("indent", IndentTag);
parser.registerTag("img", ImageTag);

parser.registerTag("url", LinkTag);

export default parser;
