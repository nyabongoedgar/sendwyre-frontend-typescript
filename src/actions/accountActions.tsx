import * as constants from '../constants';

export const successAccountCreation= (payload: any) => ({
  type: constants.SAVE_CREATED_ACCOUNT,
  payload
});

export const startAction = () => ({
  type: 'STARTED',
});

export const failedAccountCreation = (payload: any) => ({
  type: constants.ACCOUNT_CREATION_FAILED,
  payload
});

export const CheckUserAccount = (payload: any) => ({
  type: constants.ACCOUNT_FROM_DB,
  payload
});

export const SavePaymentMethod = (payload: any) => ({
  type: constants.SAVE_PAYMENT_METHOD,
  payload
});

export const SaveBlockChain = (payload: any) => ({
  type: constants.SAVE_BLOCK_CHAIN,
  payload
});

export const SetProcess = (payload: any) => ({
  type: constants.SET_PROCESS,
  payload
});

export const SaveRates = (payload: any) => ({
  type: constants.SAVE_RATES,
  payload
});

export const SetPlaidError = (payload: any) => ({
  type: constants.PLAID_ERROR,
  payload
});

export const SetBuyTransaction = (payload: any) => ({
  type: constants.BUY_TRANSACTION,
  payload
});

export const SetSellTransaction = (payload: any) => ({
  type: constants.SELL_TRANSACTION,
  payload
});