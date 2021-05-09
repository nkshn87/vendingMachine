// 標準出力用ライブラリ
const readline = require('readline-promise')
const eol = require('os').EOL; //改行コード
const utils = require('./public/libs/utils');


// 操作画面
class OperationDisplay {

    private elementNum: number; // 注文に必要な要素数
    private inputItemName: string;
    private inputPayment: number;
    private wrappingState: string;

    //  TODO 各要素の型のハードコーディング無くしたい
    constructor() {
        this.elementNum = 2;
        this.inputItemName = '';
        this.inputPayment = 0;
        this.wrappingState = 'end';
    }

    // テキストをラッピングしてコンソールへ表示する
    public showDisplayWithWrapping(text: string, type?: 'start' | 'middle' | 'end'): void {
        switch(type){
            case 'start': // textの上方に追加
                console.log(this.wrappingInitial(text));
                this.wrappingState = 'start';
                return
            case 'middle': // ラッピングなし
                console.log(this.wrappingMiddle(text));
                this.wrappingState = 'middle';
                return
            case 'end': // textの下方に追加
                console.log(this.wrappingMiddle(text));
                console.log(this.wrappingEnd());
                this.wrappingState = 'end';
                return
            default:
                if (this.wrappingState === 'start' || this.wrappingState === 'middle') {
                    // textの下方に追加
                    console.log(this.wrappingMiddle(text));
                    console.log(this.wrappingEnd());
                    return
                } else {
                    // textの上下をラッピング
                    console.log(this.wrappingInitial(text));
                    console.log(this.wrappingEnd());
                    this.wrappingState = 'end';
                    return
                }
        }
    }

    // コンソールに質問を表示し、回答を取得する
    public async questionWithFormatCheck(questionText: string, format: string, formatChecker: (self: this, text: string) => boolean): Promise<string> {
        // 正しい入力を受けるまでループ
        let result: string | null = null;
        while (result == null) {

            // 注文を入力する (null: 入力ミス)
            this.showDisplayWithWrapping(`${questionText} ${format}`, 'end');
            let self = this; // callback関数ではthisがwindowを挿してしまうため
            result = await self.stdinWithFormatCheck(self, formatChecker);

            // 入力ミスチェック
            if (result === null) {
                this.showDisplayWithWrapping(`入力ミスがあります。下記フォーマットで入力してください。${eol}${format}`, 'start');
            }
        }
        return result;
    }

    // 注文内容を取得する
    public getOrder(): Order {
        return {itemName: this.inputItemName, payment: this.inputPayment};
    }

    // 標準入力を受け付け、フォーマットのチェックを行う
    private async stdinWithFormatCheck(self: this, formatChecker: (self: this, text: string) => boolean): Promise<string | null> {
        const orderText: string = await this.stdin();
        if (formatChecker(self, orderText)) return null;
        return orderText;
    }

    // 注文受付用フォーマットチェック
    public isNotMatchOrderFormat(self: this, text: string): boolean {
        const elements: string[] = utils.decomposition(text, ':');
        if (elements.length != self.elementNum) return true;

        self.inputItemName = elements[0];
        self.inputPayment = Number(elements[1]);

        // Nanの場合（number形にキャストできない値だった場合）
        if (isNaN(self.inputPayment)) return true;

        return false;
    }

    // Yes/No質問用フォーマットチェック
    public isNotMatchYesNoFormat(self: this, text: string): boolean {
        text = text.toLowerCase();
        if (text === 'y' || text === 'n') {
            return false;
        } else {
            return true;
        }
    }

    // 標準入力
    private async stdin(): Promise<string> {
        let inputText: string = '';
        const rl = readline.default.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
        await rl.questionAsync('■ 入力：').then((answer: string) => inputText = answer);
        rl.close();
        return inputText;
    }


    /**
     * テキストのラッピングパターン
     * 連続した複数の出力を一つにまとめてラップするため
     */

    private wrappingInitial(texts: string): string {
        const splitter = '='.repeat(55);
        return `${eol}${splitter}${this.wrappingMiddle(texts)}`;
    }

    private wrappingMiddle(texts: string): string {
        const textList = texts.split('\n');
        const left = '=  ';
        let returnText = '';
        textList.forEach((text) => {
            returnText += `${eol}${left}${text}`;
        })
        return returnText;
    }

    private wrappingEnd(): string {
        return '='.repeat(50) + eol;
    }

}

export = new OperationDisplay();