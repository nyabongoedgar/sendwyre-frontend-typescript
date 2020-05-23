import * as constants from '../constants';
import {wyreActions} from "../types";

export const successAccountCreation = (payload: any): wyreActions => ({
  type: constants.SAVE_CREATED_ACCOUNT,
  payload
});

export const startAction = (payload: any) : wyreActions => ({
  type: constants.START_ACTION,
  payload
});

export const failedAccountCreation = (payload: any): wyreActions => ({
  type: constants.ACCOUNT_CREATION_FAILED,
  payload
});

export const CheckUserAccount = (payload: any): wyreActions => ({
  type: constants.ACCOUNT_FROM_DB,
  payload
});

export const SavePaymentMethod = (payload: any): wyreActions => ({
  type: constants.SAVE_PAYMENT_METHOD,
  payload
});

export const SaveBlockChain = (payload: any): wyreActions => ({
  type: constants.SAVE_BLOCK_CHAIN,
  payload
});

export const SetProcess = (payload: any): wyreActions => ({
  type: constants.SET_PROCESS,
  payload
});

export const SaveRates = (payload: any): wyreActions => ({
  type: constants.SAVE_RATES,
  payload
});

export const SaveLimits = (payload: any): wyreActions => ({
  type: constants.SAVE_LIMITS,
  payload
});

export const SetPlaidError = (payload: any): wyreActions => ({
  type: constants.PLAID_ERROR,
  payload
});

export const SetBuyTransaction = (payload: any): wyreActions => ({
  type: constants.BUY_TRANSACTION,
  payload
});

export const failedBuyTransaction = (payload: any): wyreActions => ({
  type: constants.BUY_TRANSACTION_ERROR,
  payload
});

export const SetSellTransaction = (payload: any): wyreActions => ({
  type: constants.SELL_TRANSACTION,
  payload
});

export const failedSellTransaction = (payload: any): wyreActions => ({
  type: constants.SELL_TRANSACTION_ERROR,
  payload
});

export const saveUnifyreUserProfile = (payload: any): wyreActions => ({
  type: constants.SAVE_UNIFYRE_USER_PROFILE,
  payload
});

export const saveTransferQuote = (payload: any): wyreActions => ({
  type: constants.SAVE_TRANSFER_QUOTE,
  payload
});
