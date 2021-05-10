"use strict";
var eol = require('os').EOL; //改行コード
// 操作画面
var Wrap = /** @class */ (function () {
    //  TODO 各要素の型のハードコーディング無くしたい
    function Wrap() {
        this.returnText = '';
        this.maxLength = 0;
    }
    Wrap.prototype.wrapping = function (text, type) {
        var _this = this;
        var left = '=  ';
        var textList = text.split('\n');
        textList.forEach(function (text) {
            _this.returnText += "" + left + text + eol;
            if (_this.maxLength < text.length)
                _this.maxLength = text.length;
        });
        if (type === 'standby') {
            this.returnText += "" + left + eol;
            return null;
        }
        var splitter = '='.repeat(this.maxLength * 2);
        var returnText = "" + splitter + eol + this.returnText + splitter + eol;
        this.returnText = '';
        this.maxLength = 0;
        return returnText;
    };
    return Wrap;
}());
module.exports = new Wrap();
