
export interface StoreState {
    createdWyreAccount: any;
    createWyreAccountLoading: boolean;
    accountCreationError: any;
    paymentMethod: any;
    blockChain: any;
    userInfoFromDb: any;
    process: string;
    rates: any;
    limits: any;
    plaidError: any;
    buyTransaction: any;
    buyTransactionLoading: boolean;
    buyTransactionError: any;
    sellTransaction: any;
    sellTransactionLoading: boolean;
    sellTransactionError: any,
    unifyreUserProfile: any,
    transferQuote: any
}