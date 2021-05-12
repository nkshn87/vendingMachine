"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Wrap_1 = __importDefault(require("../Wrap"));
var Wrap_2 = __importDefault(require("../Wrap"));
describe('Wrap', function () {
    beforeEach(function () {
        // シングルトンクラスのクラス変数の値をリセット
        Wrap_1.default['returnText'] = '';
        Wrap_1.default['maxLength'] = 0;
    });
    describe('constructor', function () {
        it('シングルトンクラスとしてインスタンスがexportされている', function () {
            expect(Wrap_1.default).toBe(Wrap_2.default); //TODO:シングルトンクラスのテスト確認
        });
        it(('プロパティーに初期値が設定されている'), function () {
            expect(Wrap_1.default['returnText']).toBe('');
            expect(Wrap_1.default['maxLength']).toBe(0);
        });
    });
    describe('wrapping', function () {
        it('パラメータがテキストのみの場合、ラップしたテキストを返却', function () {
            expect(Wrap_1.default.wrapping('テスト')).toBe('\n======\n= テスト\n======\n');
            expect(Wrap_1.default['returnText']).toBe('');
            expect(Wrap_1.default['maxLength']).toBe(0);
        });
        it('typeにstandbyが設定されている場合、プロパティに値を格納し、nullを返却', function () {
            expect(Wrap_1.default.wrapping('テスト', 'standby')).toBe(null);
            expect(Wrap_1.default['returnText']).toBe('= テスト\n= \n');
            expect(Wrap_1.default['maxLength']).toBe(3);
        });
    });
});
