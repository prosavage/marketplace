// handles pulling types from the other package.
const withTranspiledModules = require("next-transpile-modules")(["@savagelabs/types"])

module.exports = withTranspiledModules({
    basePath: "/marketplace",
    assetPrefix: "/marketplace",
    trailingSlash: false
})
