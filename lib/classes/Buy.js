"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Buy = void 0;
var Buy = /** @class */ (function () {
    function Buy() {
    }
    // 購入結果の出力テキストを作成する
    Buy.prototype.createBuyResultOutputText = function (itemName, deposit, payment, errorMessage) {
        var createOutputText = new CreateOutputText();
        // 購入結果
        if (errorMessage === undefined) {
            if (payment === 0) {
                createOutputText.addText('おめでとうございます！');
                createOutputText.addText(itemName);
                createOutputText.addText('をプレゼントします！');
            }
            else {
                createOutputText.addText(itemName);
                createOutputText.addText('が買えました。');
            }
        }
        else {
            createOutputText.addText(errorMessage);
        }
        createOutputText.addText('現在の預かり金は');
        createOutputText.addText(String(deposit));
        createOutputText.addText('円です。');
        createOutputText.createLine();
        // 生成したテキストを返却
        return createOutputText.outputText();
    };
    return Buy;
}());
exports.Buy = Buy;
