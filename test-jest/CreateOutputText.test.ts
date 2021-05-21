import CreateOutputText from '../src/classes/CreateOutputText';
import expectedCreateOutputTextManage from '../src/classes/CreateOutputText';
const left = '=  ';
describe('CreateOutputText', function () {
    beforeEach(() => {
        // シングルトンクラスのクラス変数の値をリセット
        CreateOutputText['outputTextList'] = [];
    })
    describe('constructor', function () {
        it('シングルトンクラスとしてインスタンスがexportされている', function () {
            expect(CreateOutputText).toBe(expectedCreateOutputTextManage); //TODO:シングルトンクラスのテスト確認
        });
        it(('プロパティーに初期値が設定されている'), function() {
            expect(CreateOutputText['outputTextList']).toEqual([]);
        })
    });
    describe('addText', function () {
        it('受け取ったtextを改行コードで分割しリストへ代入(最後に空文字を追加)', function () {
            const testText = 'てすと\nてすと';
            const expectedList = ['てすと', 'てすと'];
            expect(CreateOutputText.addText(testText));
            expect(CreateOutputText['outputTextList']).toEqual(expectedList);
        });
        it('連続実行。受け取ったtextを改行コードで分割しリストへ代入(最後に空文字を追加)', function () {
            const testText = 'てすと\nてすと';
            const expectedList = ['てすと', 'てすと', '', 'てすと', 'てすと'];
            expect(CreateOutputText.addText(testText));
            expect(CreateOutputText.addText(testText));
            expect(CreateOutputText['outputTextList']).toEqual(expectedList);
        });
    });
    describe('wrap', function () {
        it('受け取った文字列リストを結合・装飾した文字列を返却。', function () {
            const outputTextList: string[] = ['てすと', 'てすと', '', 'てすと', 'てすと'];
            const expectedText = `\n======\n${left}てすと\n${left}てすと\n${left}\n${left}てすと\n${left}てすと\n======\n`;
            expect(CreateOutputText['wrap'](outputTextList)).toEqual(expectedText);
        });
        it('空のリストの場合', function () {
            const outputTextList: string[] = [];
            const expectedText = '\n\n\n';
            expect(CreateOutputText['wrap'](outputTextList)).toEqual(expectedText);
        });
    });
});