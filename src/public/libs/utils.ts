const readline = require('readline-promise') // 標準出力

const utils = module.exports;

utils.decomposition = (text: string, format: string): string[] => {
    return (String(text)).split(format);
}

// 標準入力
utils.stdin = async (text: string): Promise<string> => {
        let inputText: string = '';
        const rl = readline.default.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
        await rl.questionAsync(text).then((answer: string) => inputText = answer);
        rl.close();
        return inputText;
}

export  = utils;