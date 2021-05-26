import { CreateOutputText } from '../classes/CreateOutputText';

const wrapLeft = '=  ';
describe('CreateOutputText', function () {
    describe('constructor', function () {
        it('インスタンス化されている', function () {
            const createOutputText = new CreateOutputText();
            expect(createOutputText).toBeInstanceOf(CreateOutputText);
        });
        it('プロパティーに初期値が設定されている', function () {
            const createOutputText = new CreateOutputText();
            expect(createOutputText['textList']).toEqual([]);
            expect(createOutputText['outputLineList']).toEqual([]);
        });
    });
    describe('outputText', function () {
        it('outputLineList内のテキストを結合・整形し返却', function () {
            const outputLineList = ['てすと', 'てすと'];
            const splitter = '='.repeat((wrapLeft + 'てすと').length + 'てすと'.length);
            const expectedText = '\n' + splitter + '\n' + wrapLeft + 'てすと\n' + wrapLeft + 'てすと\n' + splitter + '\n';
            const createOutputText = new CreateOutputText();
            createOutputText['outputLineList'] = outputLineList;
            expect(createOutputText.outputText()).toEqual(expectedText);
        });
    });
    describe('addText', function () {
        it('受け取ったtextをtextListへ追加', function () {
            const textList = 'てすと';
            const expectedOutputLineList = ['てすと'];
            const createOutputText = new CreateOutputText();
            createOutputText.addText(textList);
            expect(createOutputText['textList']).toEqual(expectedOutputLineList);
        });
        it('連続実行。受け取ったtextをtextListに追加。', function () {
            const textList = 'てすと';
            const expectedOutputLineList = ['てすと', 'てすと'];
            const createOutputText = new CreateOutputText();
            createOutputText.addText(textList);
            createOutputText.addText(textList);
            expect(createOutputText['textList']).toEqual(expectedOutputLineList);
        });
    });
    describe('createLine', function () {
        it('textListを結合し、outputLineListに追加。textList初期化', function () {
            const textList = ['てすと', 'てすと', 'てすと'];
            const expectedOutputLineList = ['てすとてすとてすと'];
            const createOutputText = new CreateOutputText();
            createOutputText['textList'] = textList;
            createOutputText.createLine();
            expect(createOutputText['outputLineList']).toEqual(expectedOutputLineList);
            expect(createOutputText['textList']).toEqual([]);
        });
        it('連続実行。textListを結合し、outputLineListに追加。textList初期化', function () {
            const textList = ['てすと', 'てすと', 'てすと'];
            const expectedOutputLineList = ['てすとてすとてすと', ''];
            const createOutputText = new CreateOutputText();
            createOutputText['textList'] = textList;
            createOutputText.createLine();
            createOutputText.createLine();
            expect(createOutputText['outputLineList']).toEqual(expectedOutputLineList);
            expect(createOutputText['textList']).toEqual([]);
        });
        it('textListが空の場合、outputLineListに空文字を追加', function () {
            const textList: Array<string> = [];
            const expectedOutputLineList = ['', ''];
            const createOutputText = new CreateOutputText();
            createOutputText['textList'] = textList;
            createOutputText.createLine();
            createOutputText.createLine();
            expect(createOutputText['outputLineList']).toEqual(expectedOutputLineList);
            expect(createOutputText['textList']).toEqual([]);
        });
    });
    describe('wrap', function () {
        it('受け取ったテキストのリストを結合・整形し返却', function () {
            const textList = ['てすと', 'てすと'];
            const splitter = '='.repeat((wrapLeft + 'てすと').length + 'てすと'.length);
            const expectedText = '\n' + splitter + '\n' + wrapLeft + 'てすと\n' + wrapLeft + 'てすと\n' + splitter + '\n';
            const createOutputText = new CreateOutputText();
            expect(createOutputText['wrap'](textList)).toEqual(expectedText);
        });
        it('空のリストの場合', function () {
            const textList: Array<string> = [];
            const expectedText = '\n\n\n';
            const createOutputText = new CreateOutputText();
            expect(createOutputText['wrap'](textList)).toEqual(expectedText);
        });
    });
});
