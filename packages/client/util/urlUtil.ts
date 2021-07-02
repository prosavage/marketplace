import {NextRouter} from "next/router";

const getBaseURL = (router: NextRouter) => {
    return `${window.location.protocol}//${window.location.host}${router.basePath}`
}

export const fileToObjectURL = (icon) => {
    if (!icon) {
        return undefined
    }
    return URL.createObjectURL(icon)
}

export default getBaseURL;