export const formatNumber = (num) => {
    if (!num || num === null) return "";
    return new Intl.NumberFormat().format(num)
}