const ellipsis = (str: string, num: number = str.length, ellipsisStr = "...") =>
    str.length >= num
        ? str.slice(0, num >= ellipsisStr.length ? num - ellipsisStr.length : num) +
        ellipsisStr
        : str;

export default ellipsis;