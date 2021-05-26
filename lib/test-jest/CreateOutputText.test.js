"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CreateOutputText_1 = require("../classes/CreateOutputText");
var wrapLeft = '=  ';
describe('CreateOutputText', function () {
    describe('constructor', function () {
        it('インスタンス化されている', function () {
            var createOutputText = new CreateOutputText_1.CreateOutputText();
            expect(createOutputText).toBeInstanceOf(CreateOutputText_1.CreateOutputText);
        });
        it('プロパティーに初期値が設定されている', function () {
            var createOutputText = new CreateOutputText_1.CreateOutputText();
            expect(createOutputText['textList']).toEqual([]);
            expect(createOutputText['outputLineList']).toEqual([]);
        });
    });
    describe('outputText', function () {
        it('outputLineList内のテキストを結合・整形し返却', function () {
            var outputLineList = ['てすと', 'てすと'];
            var splitter = '='.repeat((wrapLeft + 'てすと').length + 'てすと'.length);
            var expectedText = '\n' + splitter + '\n' + wrapLeft + 'てすと\n' + wrapLeft + 'てすと\n' + splitter + '\n';
            var createOutputText = new CreateOutputText_1.CreateOutputText();
            createOutputText['outputLineList'] = outputLineList;
            expect(createOutputText.outputText()).toEqual(expectedText);
        });
    });
    describe('addText', function () {
        it('受け取ったtextをtextListへ追加', function () {
            var textList = 'てすと';
            var expectedOutputLineList = ['てすと'];
            var createOutputText = new CreateOutputText_1.CreateOutputText();
            createOutputText.addText(textList);
            expect(createOutputText['textList']).toEqual(expectedOutputLineList);
        });
        it('連続実行。受け取ったtextをtextListに追加。', function () {
            var textList = 'てすと';
            var expectedOutputLineList = ['てすと', 'てすと'];
            var createOutputText = new CreateOutputText_1.CreateOutputText();
            createOutputText.addText(textList);
            createOutputText.addText(textList);
            expect(createOutputText['textList']).toEqual(expectedOutputLineList);
        });
    });
    describe('createLine', function () {
        it('textListを結合し、outputLineListに追加。textList初期化', function () {
            var textList = ['てすと', 'てすと', 'てすと'];
            var expectedOutputLineList = ['てすとてすとてすと'];
            var createOutputText = new CreateOutputText_1.CreateOutputText();
            createOutputText['textList'] = textList;
            createOutputText.createLine();
            expect(createOutputText['outputLineList']).toEqual(expectedOutputLineList);
            expect(createOutputText['textList']).toEqual([]);
        });
        it('連続実行。textListを結合し、outputLineListに追加。textList初期化', function () {
            var textList = ['てすと', 'てすと', 'てすと'];
            var expectedOutputLineList = ['てすとてすとてすと', ''];
            var createOutputText = new CreateOutputText_1.CreateOutputText();
            createOutputText['textList'] = textList;
            createOutputText.createLine();
            createOutputText.createLine();
            expect(createOutputText['outputLineList']).toEqual(expectedOutputLineList);
            expect(createOutputText['textList']).toEqual([]);
        });
        it('textListが空の場合、outputLineListに空文字を追加', function () {
            var textList = [];
            var expectedOutputLineList = ['', ''];
            var createOutputText = new CreateOutputText_1.CreateOutputText();
            createOutputText['textList'] = textList;
            createOutputText.createLine();
            createOutputText.createLine();
            expect(createOutputText['outputLineList']).toEqual(expectedOutputLineList);
            expect(createOutputText['textList']).toEqual([]);
        });
    });
    describe('wrap', function () {
        it('受け取ったテキストのリストを結合・整形し返却', function () {
            var textList = ['てすと', 'てすと'];
            var splitter = '='.repeat((wrapLeft + 'てすと').length + 'てすと'.length);
            var expectedText = '\n' + splitter + '\n' + wrapLeft + 'てすと\n' + wrapLeft + 'てすと\n' + splitter + '\n';
            var createOutputText = new CreateOutputText_1.CreateOutputText();
            expect(createOutputText['wrap'](textList)).toEqual(expectedText);
        });
        it('空のリストの場合', function () {
            var textList = [];
            var expectedText = '\n\n\n';
            var createOutputText = new CreateOutputText_1.CreateOutputText();
            expect(createOutputText['wrap'](textList)).toEqual(expectedText);
        });
    });
});
