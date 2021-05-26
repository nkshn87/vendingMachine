enum TextLengthType {
    fullWidth = 2,
    halfSize = 1,
}

export class CreateOutputText {
    private textList: Array<string>;
    private outputLineList: Array<string>;

    public constructor() {
        this.textList = [];
        this.outputLineList = [];
    }

    // アウトプット用テキストを返却
    public outputText(): string {
        return this.wrap(this.outputLineList);
    }

    // リストにテキスト追加
    public addText(text: string): void {
        this.textList.push(text);
    }

    // テキストを結合し出力用リストに追加 テキストリストをリセット
    public createLine(): void {
        this.outputLineList.push(this.textList.join(''));
        this.textList = [];
    }

    // 蓄積したテキストリストを結合・装飾した文字列を返却
    private wrap(lineList: Array<string>): string {
        let returnText = '';
        let maxLength = 0;
        let textLength = 0;
        const wrapLeft = '=  ';

        for (const text of lineList) {
            returnText += `${wrapLeft}${text}\n`;

            // 文字数カウント処理：半角なら１、全角なら２をtextLengthに追加
            for (const element of `${wrapLeft}${text}`) {
                if (/[ -~]/.exec(element) != null) {
                    textLength += TextLengthType.halfSize;
                } else {
                    textLength += TextLengthType.fullWidth;
                }
            }
            // 最大文字列長の更新
            const resetNum = 0;
            if (maxLength < textLength) maxLength = textLength;
            textLength = resetNum;
        }
        // テキストの上下を装飾
        const splitter = '='.repeat(maxLength);
        returnText = `\n${splitter}\n${returnText}${splitter}\n`;
        return returnText;
    }
}
