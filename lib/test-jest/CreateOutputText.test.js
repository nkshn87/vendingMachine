"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var CreateOutputText_1 = __importDefault(require("../src/classes/CreateOutputText"));
var CreateOutputText_2 = __importDefault(require("../src/classes/CreateOutputText"));
var left = '=  ';
describe('CreateOutputText', function () {
    beforeEach(function () {
        // シングルトンクラスのクラス変数の値をリセット
        CreateOutputText_1.default['outputTextList'] = [];
    });
    describe('constructor', function () {
        it('シングルトンクラスとしてインスタンスがexportされている', function () {
            expect(CreateOutputText_1.default).toBe(CreateOutputText_2.default); //TODO:シングルトンクラスのテスト確認
        });
        it(('プロパティーに初期値が設定されている'), function () {
            expect(CreateOutputText_1.default['outputTextList']).toEqual([]);
        });
    });
    describe('addText', function () {
        it('受け取ったtextを改行コードで分割しリストへ代入(最後に空文字を追加)', function () {
            var testText = 'てすと\nてすと';
            var expectedList = ['てすと', 'てすと'];
            expect(CreateOutputText_1.default.addText(testText));
            expect(CreateOutputText_1.default['outputTextList']).toEqual(expectedList);
        });
        it('連続実行。受け取ったtextを改行コードで分割しリストへ代入(最後に空文字を追加)', function () {
            var testText = 'てすと\nてすと';
            var expectedList = ['てすと', 'てすと', '', 'てすと', 'てすと'];
            expect(CreateOutputText_1.default.addText(testText));
            expect(CreateOutputText_1.default.addText(testText));
            expect(CreateOutputText_1.default['outputTextList']).toEqual(expectedList);
        });
    });
    describe('wrap', function () {
        it('受け取った文字列リストを結合・装飾した文字列を返却。', function () {
            var outputTextList = ['てすと', 'てすと', '', 'てすと', 'てすと'];
            var expectedText = "\n======\n" + left + "\u3066\u3059\u3068\n" + left + "\u3066\u3059\u3068\n" + left + "\n" + left + "\u3066\u3059\u3068\n" + left + "\u3066\u3059\u3068\n======\n";
            expect(CreateOutputText_1.default['wrap'](outputTextList)).toEqual(expectedText);
        });
        it('空のリストの場合', function () {
            var outputTextList = [];
            var expectedText = '\n\n\n';
            expect(CreateOutputText_1.default['wrap'](outputTextList)).toEqual(expectedText);
        });
    });
});
