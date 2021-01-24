"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
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
var react_1 = require("react");
var styled_components_1 = __importDefault(require("styled-components"));
var ResourceList_1 = __importDefault(require("../../components/pages/home/resourcelist/ResourceList"));
var UserHeader_1 = __importDefault(require("../../components/pages/users/UserHeader"));
var Resource_1 = require("../../types/Resource");
var AxiosInstance_1 = __importDefault(require("../../util/AxiosInstance"));
function UserById(props) {
    var _a = __read(react_1.useState(), 2), user = _a[0], setUser = _a[1];
    var _b = __read(react_1.useState(), 2), stats = _b[0], setStats = _b[1];
    react_1.useEffect(function () {
        AxiosInstance_1["default"]()
            .get("/directory/user/" + props.id)
            .then(function (res) {
            setUser(res.data.payload.user);
        });
        AxiosInstance_1["default"]()
            .get("/directory/user-stats/" + props.id)
            .then(function (res) { return setStats(res.data.payload.stats); });
    }, []);
    return (jsx_runtime_1.jsxs(Wrapper, { children: [jsx_runtime_1.jsx("h1", { children: "Author Profile" }, void 0),
            jsx_runtime_1.jsx(UserHeader_1["default"], { user: user, stats: stats }, void 0),
            jsx_runtime_1.jsx(ResourcesContainer, { children: jsx_runtime_1.jsx(ResourceList_1["default"], { type: Resource_1.ResourceType.PLUGIN, category: undefined, author: user }, void 0) }, void 0)] }, void 0));
}
exports["default"] = UserById;
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
var Wrapper = styled_components_1["default"].div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  display: flex;\n  flex-direction: column;\n  margin: 2em 0;\n  padding: 0 1em;\n  width: 100%;\n"], ["\n  display: flex;\n  flex-direction: column;\n  margin: 2em 0;\n  padding: 0 1em;\n  width: 100%;\n"])));
var ResourcesContainer = styled_components_1["default"].div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  width: 100%;\n  margin: 1em 0;\n"], ["\n  width: 100%;\n  margin: 1em 0;\n"])));
var templateObject_1, templateObject_2;
