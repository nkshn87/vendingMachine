
const utils = module.exports;

utils.decomposition = (text: string, format: string): string[] => {
    return (String(text)).split(format);
}
