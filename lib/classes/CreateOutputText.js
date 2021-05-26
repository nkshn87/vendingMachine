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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateOutputText = void 0;
var TextLengthType;
(function (TextLengthType) {
    TextLengthType[TextLengthType["fullWidth"] = 2] = "fullWidth";
    TextLengthType[TextLengthType["halfSize"] = 1] = "halfSize";
})(TextLengthType || (TextLengthType = {}));
var CreateOutputText = /** @class */ (function () {
    function CreateOutputText() {
        this.textList = [];
        this.outputLineList = [];
    }
    // アウトプット用テキストを返却
    CreateOutputText.prototype.outputText = function () {
        return this.wrap(this.outputLineList);
    };
    // リストにテキスト追加
    CreateOutputText.prototype.addText = function (text) {
        this.textList.push(text);
    };
    // テキストを結合し出力用リストに追加 テキストリストをリセット
    CreateOutputText.prototype.createLine = function () {
        this.outputLineList.push(this.textList.join(''));
        this.textList = [];
    };
    // 蓄積したテキストリストを結合・装飾した文字列を返却
    CreateOutputText.prototype.wrap = function (lineList) {
        var e_1, _a, e_2, _b;
        var returnText = '';
        var maxLength = 0;
        var textLength = 0;
        var wrapLeft = '=  ';
        try {
            for (var lineList_1 = __values(lineList), lineList_1_1 = lineList_1.next(); !lineList_1_1.done; lineList_1_1 = lineList_1.next()) {
                var text = lineList_1_1.value;
                returnText += "" + wrapLeft + text + "\n";
                try {
                    // 文字数カウント処理：半角なら１、全角なら２をtextLengthに追加
                    for (var _c = (e_2 = void 0, __values("" + wrapLeft + text)), _d = _c.next(); !_d.done; _d = _c.next()) {
                        var element = _d.value;
                        if (/[ -~]/.exec(element) != null) {
                            textLength += TextLengthType.halfSize;
                        }
                        else {
                            textLength += TextLengthType.fullWidth;
                        }
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (_d && !_d.done && (_b = _c.return)) _b.call(_c);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
                // 最大文字列長の更新
                var resetNum = 0;
                if (maxLength < textLength)
                    maxLength = textLength;
                textLength = resetNum;
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (lineList_1_1 && !lineList_1_1.done && (_a = lineList_1.return)) _a.call(lineList_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        // テキストの上下を装飾
        var splitter = '='.repeat(maxLength);
        returnText = "\n" + splitter + "\n" + returnText + splitter + "\n";
        return returnText;
    };
    return CreateOutputText;
}());
exports.CreateOutputText = CreateOutputText;
