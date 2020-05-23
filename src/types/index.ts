import * as constants from '../constants'
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
};

export interface IsuccessAccountCreation {
    type: constants.SAVE_CREATED_ACCOUNT;
    payload: any
};

export interface IstartAction {
    type: constants.START_ACTION;
    payload: any
}

export interface IfailedAccountCreation {
    type: constants.ACCOUNT_CREATION_FAILED;
    payload: any
}

export interface ICheckUserAccount {
    type: constants.ACCOUNT_FROM_DB;
    payload: any
}

export interface ISavePaymentMethod {
    type: constants.SAVE_PAYMENT_METHOD;
    payload: any
}

export interface ISaveBlockChain {
    type: constants.SAVE_BLOCK_CHAIN;
    payload: any
}

export interface ISetProcess {
    type: constants.SET_PROCESS;
    payload: any
}

export interface ISaveRates {
    type: constants.SAVE_RATES;
    payload: any
}

export interface ISaveLimits {
    type: constants.SAVE_LIMITS;
    payload: any
}

export interface ISetPlaidError {
    type: constants.PLAID_ERROR;
    payload: any
}

export interface ISetBuyTransaction {
    type: constants.BUY_TRANSACTION;
    payload: any
}

export interface IfailedBuyTransaction {
    type: constants.BUY_TRANSACTION_ERROR;
    payload: any
}

export interface ISetSellTransaction {
    type: constants.SELL_TRANSACTION;
    payload: any
}

export interface IfailedSellTransaction {
    type: constants.SELL_TRANSACTION_ERROR;
    payload: any
}
export interface IsaveUnifyreUserProfile {
    type: constants.SAVE_UNIFYRE_USER_PROFILE;
    payload: any
}

export interface IsaveTransferQuote {
    type: constants.SAVE_TRANSFER_QUOTE;
    payload: any
}

export type wyreActions = IsuccessAccountCreation | IstartAction | ICheckUserAccount | ISaveBlockChain |ISaveLimits | ISavePaymentMethod | ISaveRates | ISetBuyTransaction | ISetPlaidError | ISetProcess | ISetSellTransaction | IfailedAccountCreation | IfailedBuyTransaction | IfailedSellTransaction | IsaveTransferQuote | IsaveUnifyreUserProfile