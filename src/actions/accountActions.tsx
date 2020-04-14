export const successAccountCreation= (payload: any) => ({
  type: 'SUCCESSFUL',
  payload
});

export const startAction = () => ({
  type: 'STARTED',
});

export const failedCreation = (payload: any) => ({
  type: 'FAILED',
  payload
});

export const CheckUserAccount = (payload: any) => ({
  type: 'ACCOUNT_FROM_DB',
  payload
});

export const SavePaymentMethod = (payload: any) => ({
  type: 'SAVE_PAYMENT_METHOD',
  payload
});

export const SaveBlockChain = (payload: any) => ({
  type: 'SAVE_BLOCK_CHAIN',
  payload
});

export const SetProcess = (payload: any) => ({
  type: 'SET_PROCESS',
  payload
});

export const SaveRates = (payload: any) => ({
  type: 'SAVE_RATES',
  payload
})