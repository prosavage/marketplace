import {NextRouter} from "next/router";

const getBaseURL = (router: NextRouter) => {
    return `${window.location.protocol}//${window.location.host}${router.basePath}`
}

export default getBaseURL;