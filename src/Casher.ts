// お金管理装置
class Casher {

    private deposit: number;
    private mode: 'nomal'|'free';

    constructor() {
        this.deposit = 0;
        this.mode = 'nomal';
    }

    // 投入金額を格納
    // public addDeposit(payment: number): void { this.deposit += payment; }
    public addDeposit(payment: number): void {
        this.deposit += payment;
    }

    // 支払い実行
    public pay(price: number): string {
        this.swichMode();

        // 一定確率で全額返金する。
        if (this.mode === 'free') {
            this.mode = 'nomal';
            return 'free';
        }
        const diff = this.deposit - price;
        if (diff < 0) throw `${Math.abs(diff)}円足りません。`;
        this.deposit -= price;
        return 'nomal';
    }

    // お釣りの払い出し
    public payoutChange():number {
        const change = this.deposit;
        this.deposit = 0;
        return change;
    }

    // 購入可能か判定
    public checkCanBuyAnother(num: number): boolean {
        return num <= this.deposit;
    }

    // 預かり金取得
    public getDeposit(): number {
        return this.deposit;
    }

    // 一定確率でモードを切り替える
    private swichMode():void {
        if (Math.floor(Math.random() * 10) === 1) {
            this.mode = 'free';
        };
    }
}

export = new Casher();