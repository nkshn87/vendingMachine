// 操作画面
class Wrap {
    private textList: string[];

    constructor() {
        this.textList = [];
    }

    // リストにテキスト追加
    public addText(text: string): void {
        if (this.textList.length !== 0) this.textList.push(""); // １行空ける
        this.textList = this.textList.concat(text.split('\n'));
    }

    // アウトプット用テキストを返却
    public outputText(text: string): string {
        this.addText(text);
        const returntext = this.wrap(this.textList);
        this.textList = [];
        return returntext;
    }

    // 蓄積したテキストリストを結合、装飾した文字列を返却
    private wrap(textList: string[]): string {
        const left = '=  ';
        let returnText = '';
        let maxLength = 0;
        for (let text of textList) {
            returnText += `${left}${text}\n`;
            if (maxLength < text.length) maxLength = text.length;　// 最大文字数取得
        }
        const splitter = '='.repeat(maxLength*2);
        returnText = `\n${splitter}\n${returnText}${splitter}\n`;
        return returnText;
    }
}

export = new Wrap();