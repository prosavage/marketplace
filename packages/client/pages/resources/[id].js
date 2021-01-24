"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.getServerSideProps = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var router_1 = require("next/router");
var react_1 = require("react");
var react_feather_1 = require("react-feather");
var styled_components_1 = __importDefault(require("styled-components"));
var ResourceHeader_1 = __importDefault(require("../../components/pages/resource/ResourceHeader"));
var Button_1 = __importDefault(require("../../components/ui/Button"));
var AxiosInstance_1 = __importDefault(require("../../util/AxiosInstance"));
var PluginInfo_1 = __importDefault(require("../../components/pages/resource/PluginInfo"));
var ResourceThread_1 = __importDefault(require("../../components/pages/resource/ResourceThread"));
var DiscordInfo_1 = __importDefault(require("../../components/pages/resource/DiscordInfo"));
var ResourceEdit_1 = __importDefault(require("../../components/pages/resource/ResourceEdit"));
var ResourceRating_1 = __importDefault(require("../../components/pages/resource/ResourceRating"));
function ResourceId(props) {
    var _a = __read(react_1.useState(), 2), resource = _a[0], setResource = _a[1];
    var _b = __read(react_1.useState([]), 2), versions = _b[0], setVersions = _b[1];
    var _c = __read(react_1.useState(), 2), author = _c[0], setAuthor = _c[1];
    var router = router_1.useRouter();
    react_1.useEffect(function () {
        AxiosInstance_1["default"]()
            .get("/resources/" + props.id)
            .then(function (res) { return setResource(res.data.payload.resource); });
        AxiosInstance_1["default"]()
            .get("/directory/versions/resource/" + props.id + "/1")
            .then(function (res) {
            setVersions(res.data.payload.versions);
        });
    }, []);
    react_1.useEffect(function () {
        if (!resource)
            return;
        AxiosInstance_1["default"]()
            .get("/directory/user/" + resource.owner)
            .then(function (res) { return setAuthor(res.data.payload.user); });
    }, [resource]);
    var getFirstVersion = function () {
        return versions[versions.length - 1];
    };
    return (jsx_runtime_1.jsxs(Wrapper, { children: [jsx_runtime_1.jsx("div", { children: jsx_runtime_1.jsxs(BackButton, __assign({ onClick: function () { return router.back(); } }, { children: [jsx_runtime_1.jsx(react_feather_1.ArrowLeft, { size: "15px" }, void 0), " ", jsx_runtime_1.jsx(ButtonText, { children: "Return to plugins" }, void 0)] }), void 0) }, void 0),
            jsx_runtime_1.jsxs(ResourceContentContainer, { children: [jsx_runtime_1.jsxs(ResourceBody, { children: [jsx_runtime_1.jsx(ResourceHeader_1["default"], { resource: resource, version: versions[0] }, void 0),
                            jsx_runtime_1.jsx(ResourceThread_1["default"], { resource: resource }, void 0),
                            jsx_runtime_1.jsx(ResourceRating_1["default"], { resource: resource }, void 0)] }, void 0),
                    jsx_runtime_1.jsxs(MetadataContainer, { children: [jsx_runtime_1.jsx(PluginInfo_1["default"], { author: author, resource: resource, firstVersion: getFirstVersion() }, void 0),
                            jsx_runtime_1.jsx(ResourceEdit_1["default"], { resource: resource }, void 0),
                            jsx_runtime_1.jsx(DiscordInfo_1["default"], { discordServerId: author === null || author === void 0 ? void 0 : author.discordServerId }, void 0)] }, void 0)] }, void 0)] }, void 0));
}
exports["default"] = ResourceId;
function getServerSideProps(_a) {
    var params = _a.params;
    return __awaiter(this, void 0, void 0, function () {
        var id;
        return __generator(this, function (_b) {
            id = params.id;
            return [2 /*return*/, { props: { id: id } }];
        });
    });
}
exports.getServerSideProps = getServerSideProps;
var Wrapper = styled_components_1["default"].div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  display: flex;\n  flex-direction: column;\n  width: 100%;\n  padding: 2em;\n"], ["\n  display: flex;\n  flex-direction: column;\n  width: 100%;\n  padding: 2em;\n"])));
var BackButton = styled_components_1["default"](Button_1["default"])(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  width: auto;\n  padding: 12px 20px !important;\n  color: black !important;\n  background: ", " !important;\n\n  display: flex;\n  flex-direction: row;\n  justify-content: center;\n  align-items: center;\n"], ["\n  width: auto;\n  padding: 12px 20px !important;\n  color: black !important;\n  background: ", " !important;\n\n  display: flex;\n  flex-direction: row;\n  justify-content: center;\n  align-items: center;\n"])), function (props) { return props.theme.accentColor; });
var ButtonText = styled_components_1["default"].p(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  margin: 0 0.5em;\n"], ["\n  margin: 0 0.5em;\n"])));
var ResourceContentContainer = styled_components_1["default"].div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  display: flex;\n  flex-direction: row;\n  width: 100%;\n  margin: 2em 0;\n\n  @media(max-width: 1000px) {\n    flex-direction: column;\n  }\n"], ["\n  display: flex;\n  flex-direction: row;\n  width: 100%;\n  margin: 2em 0;\n\n  @media(max-width: 1000px) {\n    flex-direction: column;\n  }\n"])));
var ResourceBody = styled_components_1["default"].div(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  display: flex;\n  flex-direction: column;\n  flex-basis: 70%;\n"], ["\n  display: flex;\n  flex-direction: column;\n  flex-basis: 70%;\n"])));
var MetadataContainer = styled_components_1["default"].div(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  display: flex;\n  flex-direction: column;\n  flex-basis: 30%;\n  margin: 0 1em;\n"], ["\n  display: flex;\n  flex-direction: column;\n  flex-basis: 30%;\n  margin: 0 1em;\n"])));
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6;
