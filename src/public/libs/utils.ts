import readline from 'readline'; // 標準入力
const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });

export class Utils {
    static decomposition(text: string, format: string): Array<string> {
        return (String(text)).split(format);
    }

    static async stdin(text: string): Promise<string> {
        const answer = await this.question(text);
        rl.close();
        return answer;
    }

    private static question(text: string): Promise<string> {
        return new Promise(resolve => {
            rl.question(text, resolve);
        });
    }

    static randomNumFloor(maxNum: number): number {
        // 0~99: maxNum=100
        return Math.floor(Math.random() * maxNum);
    }
}
