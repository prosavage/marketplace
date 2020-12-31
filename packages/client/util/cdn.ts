export const cdnBaseURL = "https://marketplace-savagelabs.b-cdn.net"


export const getResourceIconURL = (resourceId: string) => {
    return `${cdnBaseURL}/resources/${resourceId}/icon.png`
}