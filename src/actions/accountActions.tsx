export const successAccountCreation= (data: any) => ({
  type: 'SUCCESSFUL',
  payload: data,
});

export const startAction = () => ({
  type: 'STARTED',
});

export const failedCreation = (err: any) => ({
  type: 'FAILED',
  payload: err,
});

export const CheckUserAccount = (data: any) => ({
  type: 'ACCOUNT_FROM_DB',
  payload: data
});

export const SavePaymentMethod = (paymentMethod: any) => ({
  type: 'SAVE_PAYMENT_METHOD',
  payload: paymentMethod
})

export const SaveBlockChain = (blockChain: any) => ({
  type: 'SAVE_BLOCK_CHAIN',
  payload: blockChain
})
