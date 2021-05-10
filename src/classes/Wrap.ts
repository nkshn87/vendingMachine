const eol = require('os').EOL; //改行コード

// 操作画面
class Wrap {
    private returnText: string;
    private maxLength: number;

    //  TODO 各要素の型のハードコーディング無くしたい
    constructor() {
        this.returnText = '';
        this.maxLength = 0;
    }

    public wrapping(text: string, type?: 'standby'): string | null { //TODO:MAX文字数
        const left = '=  ';
        const textList = text.split('\n');
        textList.forEach((text) => {
            this.returnText += `${left}${text}${eol}`;
            if (this.maxLength < text.length) this.maxLength = text.length;
        })

        if (type === 'standby') {
            this.returnText += `${left}${eol}`;
            return null;
        }

        const splitter = '='.repeat(this.maxLength*2);
        let returnText = `${splitter}${eol}${this.returnText}${splitter}${eol}`;
        this.returnText = '';
        this.maxLength = 0;
        return returnText;
    }

    // // テキストをラッピングしてコンソールへ表示する
    // public wrapping(text: string, type?: 'start' | 'middle' | 'end'): string { //TODO:MAX文字数
    //     switch(type){
    //         case 'start':
    //             this.wrappingState = 'start';
    //             return this.wrappingInitial(text); // textの上方に追加
    //         case 'middle':
    //             this.wrappingState = 'middle';
    //             return this.wrappingMiddle(text); // ラッピングなし
    //         case 'end':
    //             console.log();
    //             this.wrappingState = 'end';
    //             return `${this.wrappingMiddle(text)}${eol}${this.wrappingEnd()}`; // textの下方に追加
    //         default:
    //             if (this.wrappingState === 'start' || this.wrappingState === 'middle') {
    //                 this.wrappingState = 'end';
    //                 return `${this.wrappingMiddle(text)}${eol}${this.wrappingEnd()}`; // textの下方に追加
    //             } else {
    //                 // textの上下をラッピング
    //                 this.wrappingState = 'end';
    //                 return `${this.wrappingInitial(text)}${eol}${this.wrappingEnd()}`; // textの上下をラッピング
    //             }
    //     }
    // }

    /**
     * テキストのラッピングパターン
     * 連続した複数の出力を一つにまとめてラップするため
     */

    // private wrappingInitial(texts: string): string {
    //     this.startWrapLength = texts.length;
    //     const splitter = '='.repeat(this.startWrapLength);
    //     return `${eol}${splitter}${this.wrappingMiddle(texts)}`;
    // }

    // private wrappingMiddle(texts: string): string {
    //     const textList = texts.split('\n');
    //     const left = '=  ';
    //     let returnText = '';
    //     textList.forEach((text) => {
    //         returnText += `${eol}${left}${text}`;
    //     })
    //     return returnText;
    // }

    // private wrappingEnd(): string {
    //     return '='.repeat(this.startWrapLength) + eol;
    // }

}

export = new Wrap();