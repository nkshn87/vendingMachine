"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
// 操作画面
var Wrap = /** @class */ (function () {
    function Wrap() {
        this.textList = [];
    }
    // リストにテキスト追加
    Wrap.prototype.addText = function (text) {
        if (this.textList.length !== 0)
            this.textList.push(""); // １行空ける
        this.textList = this.textList.concat(text.split('\n'));
    };
    // アウトプット用テキストを返却
    Wrap.prototype.outputText = function (text) {
        this.addText(text);
        var returntext = this.wrap(this.textList);
        this.textList = [];
        return returntext;
    };
    // 蓄積したテキストリストを結合、装飾した文字列を返却
    Wrap.prototype.wrap = function (textList) {
        var e_1, _a;
        var left = '=  ';
        var returnText = '';
        var maxLength = 0;
        try {
            for (var textList_1 = __values(textList), textList_1_1 = textList_1.next(); !textList_1_1.done; textList_1_1 = textList_1.next()) {
                var text = textList_1_1.value;
                returnText += "" + left + text + "\n";
                if (maxLength < text.length)
                    maxLength = text.length; // 最大文字数取得
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (textList_1_1 && !textList_1_1.done && (_a = textList_1.return)) _a.call(textList_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        var splitter = '='.repeat(maxLength * 2);
        returnText = "\n" + splitter + "\n" + returnText + splitter + "\n";
        return returnText;
    };
    return Wrap;
}());
module.exports = new Wrap();
