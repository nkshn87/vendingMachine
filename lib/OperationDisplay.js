"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
// 標準出力用ライブラリ
var readline = require('readline-promise');
var eol = require('os').EOL; //改行コード
var utils = require('./public/libs/utils');
// 操作画面
var OperationDisplay = /** @class */ (function () {
    //  TODO 各要素の型のハードコーディング無くしたい
    function OperationDisplay() {
        this.elementNum = 2;
        this.inputItemName = '';
        this.inputPayment = 0;
        this.wrappingState = 'end';
    }
    // テキストをラッピングしてコンソールへ表示する
    OperationDisplay.prototype.showDisplayWithWrapping = function (text, type) {
        switch (type) {
            case 'start': // textの上方に追加
                console.log(this.wrappingInitial(text));
                this.wrappingState = 'start';
                return;
            case 'middle': // ラッピングなし
                console.log(this.wrappingMiddle(text));
                this.wrappingState = 'middle';
                return;
            case 'end': // textの下方に追加
                console.log(this.wrappingMiddle(text));
                console.log(this.wrappingEnd());
                this.wrappingState = 'end';
                return;
            default:
                if (this.wrappingState === 'start' || this.wrappingState === 'middle') {
                    // textの下方に追加
                    console.log(this.wrappingMiddle(text));
                    console.log(this.wrappingEnd());
                    return;
                }
                else {
                    // textの上下をラッピング
                    console.log(this.wrappingInitial(text));
                    console.log(this.wrappingEnd());
                    this.wrappingState = 'end';
                    return;
                }
        }
    };
    // コンソールに質問を表示し、回答を取得する
    OperationDisplay.prototype.questionWithFormatCheck = function (questionText, format, formatChecker) {
        return __awaiter(this, void 0, void 0, function () {
            var result, self_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        result = null;
                        _a.label = 1;
                    case 1:
                        if (!(result === null)) return [3 /*break*/, 3];
                        // 注文を入力する (null: 入力ミス)
                        this.showDisplayWithWrapping(questionText + " " + format, 'end');
                        self_1 = this;
                        return [4 /*yield*/, self_1.stdinWithFormatCheck(self_1, formatChecker)];
                    case 2:
                        result = _a.sent();
                        // 入力ミスチェック
                        if (result === null) {
                            this.showDisplayWithWrapping("\u5165\u529B\u30DF\u30B9\u304C\u3042\u308A\u307E\u3059\u3002\u4E0B\u8A18\u30D5\u30A9\u30FC\u30DE\u30C3\u30C8\u3067\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002" + eol + format, 'start');
                        }
                        return [3 /*break*/, 1];
                    case 3: return [2 /*return*/, result];
                }
            });
        });
    };
    // 注文内容を取得する
    OperationDisplay.prototype.getOrder = function () {
        return { itemName: this.inputItemName, payment: this.inputPayment };
    };
    // 注文受付用フォーマットチェック
    OperationDisplay.prototype.isNotMatchOrderFormat = function (self, text) {
        var elements = utils.decomposition(text, ':');
        if (elements.length != self.elementNum)
            return true;
        self.inputItemName = elements[0];
        self.inputPayment = Number(elements[1]);
        // Nanの場合（number形にキャストできない値だった場合）
        if (isNaN(self.inputPayment))
            return true;
        return false;
    };
    // Yes/No質問用フォーマットチェック
    OperationDisplay.prototype.isNotMatchYesNoFormat = function (self, text) {
        text = text.toLowerCase();
        if (text === 'y' || text === 'n') {
            return false;
        }
        else {
            return true;
        }
    };
    // 標準入力を受け付け、フォーマットのチェックを行う
    OperationDisplay.prototype.stdinWithFormatCheck = function (self, formatChecker) {
        return __awaiter(this, void 0, void 0, function () {
            var orderText;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.stdin()];
                    case 1:
                        orderText = _a.sent();
                        if (formatChecker(self, orderText))
                            return [2 /*return*/, null];
                        return [2 /*return*/, orderText];
                }
            });
        });
    };
    // 標準入力
    OperationDisplay.prototype.stdin = function () {
        return __awaiter(this, void 0, void 0, function () {
            var inputText, rl;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        inputText = '';
                        rl = readline.default.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
                        return [4 /*yield*/, rl.questionAsync('■ 入力：').then(function (answer) { return inputText = answer; })];
                    case 1:
                        _a.sent();
                        rl.close();
                        return [2 /*return*/, inputText];
                }
            });
        });
    };
    /**
     * テキストのラッピングパターン
     * 連続した複数の出力を一つにまとめてラップするため
     */
    OperationDisplay.prototype.wrappingInitial = function (texts) {
        var splitter = '='.repeat(55);
        return "" + eol + splitter + this.wrappingMiddle(texts);
    };
    OperationDisplay.prototype.wrappingMiddle = function (texts) {
        var textList = texts.split('\n');
        var left = '=  ';
        var returnText = '';
        textList.forEach(function (text) {
            returnText += "" + eol + left + text;
        });
        return returnText;
    };
    OperationDisplay.prototype.wrappingEnd = function () {
        return '='.repeat(50) + eol;
    };
    return OperationDisplay;
}());
module.exports = new OperationDisplay();
