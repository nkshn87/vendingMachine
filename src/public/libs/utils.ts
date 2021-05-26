import readline from 'readline'; // 標準入力

export class Utils {
    private constructor() {}

    public static decomposition(text: string, format: string): Array<string> {
        return String(text).split(format);
    }

    public static async stdin(text: string): Promise<string> {
        const answer = await this.question(text);
        return answer;
    }

    private static question(text: string): Promise<string> {
        const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
        return new Promise(resolve => {
            rl.question(text, (answer: string) => {
                resolve(answer);
                rl.close();
            });
        });
    }

    public static randomNumFloor(maxNum: number): number {
        // 0~99: maxNum=100
        return Math.floor(Math.random() * maxNum);
    }
}
