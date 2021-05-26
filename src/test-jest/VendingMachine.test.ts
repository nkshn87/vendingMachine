/* eslint @typescript-eslint/no-non-null-assertion: off */
//TODO:確率で結果が変わるメソッドのテスト

import { VendingMachine } from '../classes/VendingMachine';
import { CreateOutputText } from '../classes/CreateOutputText';
import { mockProcessStdout } from 'jest-mock-process';
import { Item } from '../classes/Item';

// 定数
const zeroStock = 0;
const oneStock = 1;
const twoStock = 2;
const zoroYen = 0;
const oneHundredYen = 100;
const twoHundredYen = 200;

describe('vendingMachine', function () {
    describe('constructor', function () {
        it('インスタンス化されている', function () {
            const vendingMachine = new VendingMachine();
            expect(vendingMachine).toBeInstanceOf(VendingMachine);
        });
    });
    describe('addStock', function () {
        it('正常パターン：商品の在庫に追加する', function () {
            const vendingMachine = new VendingMachine();
            vendingMachine.addStock('item', oneHundredYen, oneStock);
            expect(vendingMachine['stockManage'].getItem('item')!.getName()).toBe('item');
        });
        it('異常パターン：追加在庫数不正はエラーを投げる', function () {
            const vendingMachine = new VendingMachine();
            const minusStock = -1;
            expect(() => {
                vendingMachine.addStock('item', oneHundredYen, minusStock);
            }).toThrowError('itemの追加在庫数の値が不正です。: -1');
        });
    });
    describe('isBuyable', function () {
        it('残金が商品の最小価格以上の場合、True', function () {
            const vendingMachine = new VendingMachine();
            vendingMachine['stockManage'].addStock('item1', oneHundredYen, oneStock); // 残金以内の価格の商品を在庫に追加
            vendingMachine['deposit'].addDeposit(oneHundredYen); // 残金追加

            expect(vendingMachine['isBuyable']()).toBeTruthy();
        });
        it('残金が商品の最小価格未満の場合、True', function () {
            const vendingMachine = new VendingMachine();
            vendingMachine['stockManage'].addStock('item1', twoHundredYen, oneStock); // 残金以内の価格の商品を在庫に追加
            vendingMachine['deposit'].addDeposit(oneHundredYen); // 残金追加

            expect(vendingMachine['isBuyable']()).toBeFalsy();
        });
    });
    describe('payout', function () {
        it('残金をリセット、精算メッセージを標準出力、True返却', function () {
            const vendingMachine = new VendingMachine();
            vendingMachine['deposit'].addDeposit(oneHundredYen); // 残金追加
            const mockStdout = mockProcessStdout();
            // True返却確認
            expect(vendingMachine['payout']()).toBeTruthy();
            // 残金リセット確認
            expect(vendingMachine['deposit'].showDeposit()).toBe(0);
            // createPayOutResultOutputTextの呼び出し
            expect(mockStdout).toHaveBeenCalledWith(vendingMachine['createPayOutResultOutputText'](oneHundredYen));
        });
    });
    describe('getBuyableItems', function () {
        it('商品一覧を取得', function () {
            const expectedItemList = [
                new Item('item1', oneHundredYen),
                new Item('item2', oneHundredYen),
                new Item('item3', oneHundredYen),
            ];
            const vendingMachine = new VendingMachine();
            vendingMachine['deposit'].addDeposit(oneHundredYen); // 残金追加
            vendingMachine['stockManage'].addStock('item1', oneHundredYen, oneStock);
            vendingMachine['stockManage'].addStock('item2', oneHundredYen, oneStock);
            vendingMachine['stockManage'].addStock('item3', oneHundredYen, oneStock);
            expect(vendingMachine['getBuyableItems']()).toEqual(expectedItemList);
        });
        it('残金以上の商品は表示しない', function () {
            const expectedItemList = [new Item('item1', oneHundredYen)];
            const vendingMachine = new VendingMachine();
            vendingMachine['deposit'].addDeposit(oneHundredYen); // 残金追加
            vendingMachine['stockManage'].addStock('item1', oneHundredYen, oneStock);
            vendingMachine['stockManage'].addStock('item2', twoHundredYen, oneStock);
            expect(vendingMachine['getBuyableItems']()).toEqual(expectedItemList);
        });
        it('在庫のない商品は表示しない', function () {
            const expectedItemList = [new Item('item1', oneHundredYen)];
            const vendingMachine = new VendingMachine();
            vendingMachine['deposit'].addDeposit(oneHundredYen); // 残金追加
            vendingMachine['stockManage'].addStock('item1', oneHundredYen, oneStock);
            vendingMachine['stockManage'].addStock('item2', oneHundredYen, oneStock);
            vendingMachine['stockManage'].decrementStockMap(vendingMachine['stockManage'].getItem('item2')!); //在庫ひとつ減らす
            expect(vendingMachine['getBuyableItems']()).toEqual(expectedItemList);
        });
        it('残金が0円の場合は、商品の値段に関わらず、在庫のある全ての商品を取得', function () {
            const expectedItemList = [new Item('item1', oneHundredYen), new Item('item2', twoHundredYen)];
            const vendingMachine = new VendingMachine();
            vendingMachine['deposit'].addDeposit(zoroYen); // 残金追加
            vendingMachine['stockManage'].addStock('item1', oneHundredYen, oneStock);
            vendingMachine['stockManage'].addStock('item2', twoHundredYen, oneStock);
            expect(vendingMachine['getBuyableItems']()).toEqual(expectedItemList);
        });
    });
    describe('createMenuOutputText', function () {
        it('テキストリストを装飾・整形し返却', function () {
            const itemList = [new Item('item1', oneHundredYen), new Item('item2', oneHundredYen)];
            const expectedItemList = [
                new Item('item1', oneHundredYen),
                new Item('item2', oneHundredYen),
                new Item('item3', oneHundredYen),
            ];
            const vendingMachine = new VendingMachine();
            vendingMachine['deposit'].addDeposit(oneHundredYen); // 残金追加
            vendingMachine['stockManage'].addStock('item1', oneHundredYen, oneStock);
            vendingMachine['stockManage'].addStock('item2', oneHundredYen, oneStock);
            vendingMachine['stockManage'].addStock('item3', oneHundredYen, oneStock);
            expect(vendingMachine['getBuyableItems']()).toEqual(expectedItemList);
        });
    });
    // describe('buy', function () {
    //     it('フォーマットエラー（コロンがない）の場合、メッセージを標準出力しFalseを返却', function () {
    //         const vendingMachine = new VendingMachine();
    //         vendingMachine['stockManage'].addStock('item', oneHundredYen, oneStock);

    //         const mockStdout = mockProcessStdout();
    //         expect(vendingMachine.buy('item100')).toBeFalsy();
    //         const expectedText = '入力ミスがあります。下記フォーマットで入力してください。\n商品名：投入金額(単位なし)';
    //         expect(mockStdout).toHaveBeenCalledWith(vendingMachine['createOutputText'].outputText(expectedText));
    //     });
    //     it('フォーマットエラー（コロンが複数）の場合、メッセージを標準出力しFalseを返却', function () {
    //         const vendingMachine = new VendingMachine();
    //         vendingMachine['stockManage'].addStock('item', oneHundredYen, oneStock);

    //         const mockStdout = mockProcessStdout();
    //         expect(vendingMachine.buy('item:100:100')).toBeFalsy();
    //         const expectedText = '入力ミスがあります。下記フォーマットで入力してください。\n商品名：投入金額(単位なし)';
    //         expect(mockStdout).toHaveBeenCalledWith(vendingMachine['createOutputText'].outputText(expectedText));
    //     });
    //     it('フォーマットエラー（料金がnumberにキャストできない値）の場合、メッセージを標準出力しFalseを返却', function () {
    //         const vendingMachine = new VendingMachine();
    //         vendingMachine['stockManage'].addStock('item', oneHundredYen, oneStock);

    //         const mockStdout = mockProcessStdout();
    //         expect(vendingMachine.buy('item:test')).toBeFalsy();
    //         const expectedText = '入力ミスがあります。下記フォーマットで入力してください。\n商品名：投入金額(単位なし)';
    //         expect(mockStdout).toHaveBeenCalledWith(vendingMachine['createOutputText'].outputText(expectedText));
    //     });
    //     it('正常パターン。在庫を一つ減らす：メッセージをcreateOutputTextのメンバー変数に格納：Trueを返却', function () {
    //         const vendingMachine = new VendingMachine();
    //         const ordertext = 'item:150';
    //         vendingMachine['stockManage'].addStock('item', oneHundredYen, twoStock); //100円の商品「item」を2つ在庫に追加

    //         expect(vendingMachine.buy(ordertext)).toBeTruthy();
    //         expect(vendingMachine['stockManage']['stockMap'].get(vendingMachine['stockManage'].getItem('item')!)).toBe(
    //             oneStock
    //         );
    //         const expectList = ['itemが買えました。現在の預かり金は50円です。'];
    //         expect(vendingMachine['createOutputText']['outputTextList']).toEqual(expectList);
    //     });
    //     it('在庫がない場合。在庫変化なし：お釣り払い出しなし：メッセージをcreateOutputTextのメンバー変数に格納：Falseを返却', function () {
    //         const vendingMachine = new VendingMachine();
    //         const ordertext = 'item1:100';
    //         vendingMachine['stockManage'].addStock('item1', oneHundredYen, oneStock);
    //         vendingMachine['stockManage'].addStock('item2', oneHundredYen, oneStock);
    //         vendingMachine['stockManage'].decrementStockMap(vendingMachine['stockManage'].getItem('item1')!); // item1の在庫を一つ減らす
    //         expect(vendingMachine.buy(ordertext)).toBeFalsy();
    //         expect(vendingMachine['stockManage']['stockMap'].get(vendingMachine['stockManage'].getItem('item1')!)).toBe(
    //             zeroStock
    //         ); // 在庫変化なし
    //         expect(vendingMachine['stockManage']['stockMap'].get(vendingMachine['stockManage'].getItem('item2')!)).toBe(
    //             oneStock
    //         ); // 在庫変化なし
    //         expect(vendingMachine['deposit'].getDeposit()).toBe(oneHundredYen); // お釣り払い出しなし
    //         const expectList = [`item1は売り切れです。現在の預かり金は100円です。`];
    //         expect(vendingMachine['createOutputText']['outputTextList']).toEqual(expectList);
    //     });
    //     it('投入金額が商品の価格を下回る場合、在庫変化なし：メッセージをcreateOutputTextインスタンスのメンバー変数に格納：Falseを返却', function () {
    //         const vendingMachine = new VendingMachine();
    //         const ordertext = 'item:50';
    //         vendingMachine['stockManage'].addStock('item', oneHundredYen, oneStock);

    //         expect(vendingMachine.buy(ordertext)).toBeFalsy();
    //         expect(vendingMachine['stockManage']['stockMap'].get(vendingMachine['stockManage'].getItem('item')!)).toBe(
    //             oneStock
    //         ); // 在庫変化なし
    //         const expectList = ['50円足りません。現在の預かり金は50円です。'];
    //         expect(vendingMachine['createOutputText']['outputTextList']).toEqual(expectList);
    //     });
    //     // 在庫がないかつ残金で追加購入不可能な場合 => 購入不可能な残金でbuyが呼ばれることはない
    // });
    // describe('showDisplay', function () {
    //     it('受け取ってテキストを整形し、標準出力する', function () {
    //         const vendingMachine = new VendingMachine();
    //         vendingMachine.addStock('item', oneHundredYen, oneStock);

    //         const mockStdout = mockProcessStdout();
    //         const testText = 'item';
    //         vendingMachine['showDisplay'](testText); //NOTE:privateメソッドの実行
    //         expect(mockStdout).toHaveBeenCalledWith(vendingMachine['createOutputText'].outputText(testText));
    //     });
    // });
});
