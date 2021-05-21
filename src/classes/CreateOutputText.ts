
enum TextLengthType {
    fullWidth = 2,
    halfSize = 1,
}

class CreateOutputText {
    private outputTextList: Array<string>;

    public constructor() {
        this.outputTextList = [];
    }

    // リストにテキスト追加
    public addText(text: string): void {
        // 2回目以降の追加の場合１行空けるため空文字を追加
        if (this.outputTextList.length > 0) this.outputTextList.push('');
        this.outputTextList = this.outputTextList.concat(text.split('\n'));
    }

    // アウトプット用テキストを返却
    public outputText(text: string): string {
        this.addText(text);
        const returntext = this.wrap(this.outputTextList);
        this.outputTextList = [];
        return returntext;
    }

    // 蓄積したテキストリストを結合・装飾した文字列を返却
    private wrap(textList: ReadonlyArray<string>): string {
        let returnText: string = '';
        let maxLength = 0;
        let textLength = 0;
        const wrapLeft = '=  ';

        for (const text of textList) {
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

export = new CreateOutputText();
