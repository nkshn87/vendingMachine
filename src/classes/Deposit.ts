import { OrderFormatError } from '../errors/FormatError';

// お金管理装置
export class Deposit {
    private deposit: number;

    public constructor() {
        this.deposit = 0;
    }

    // 投入金額を格納
    public addDeposit(payment: number): boolean {
        if (payment < 0) throw new OrderFormatError('投入金額が不正です： ' + String(payment));
        this.deposit += payment;
        return true;
    }

    // 支払い実行
    public pay(price: number): boolean {
        //TODO:入力チェック マイナス
        if (price < 0) throw new OrderFormatError('商品価格が不正です。： ' + String(price));
        const diff = this.deposit - price;
        if (diff < 0) throw new OrderFormatError(String(Math.abs(diff)) + '円足りません。');
        this.deposit -= price;
        return true;
    }

    // お釣りの払い出し
    public payout(): number {
        //TODO:deposit返したい resetならわかる
        const deposit = this.deposit;
        this.deposit = 0;
        return deposit;
    }

    // 残金確認 //TODO:getは違和感
    public showDeposit(): number {
        return this.deposit;
    }
}
