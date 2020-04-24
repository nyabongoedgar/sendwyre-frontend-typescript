import * as constants from '../constants';

const intialState = {
  account: null,
  loading: false,
  paymentMethod: null,
  blockChain: null,
  accountFromDb: null,
  process: null,
  rates: null,
  plaidError: null,
  accountCreationError: null,
  buyTransaction: null,
  sellTransaction: null
};

const AccountReducer = (state = intialState, action: any) => {
  switch (action.type) {
    case 'STARTED':
      return {
        ...state,
        loading: true
      };
    case constants.SAVE_CREATED_ACCOUNT:
      console.log('.............', action.payload)
      return {
        ...state,
        account: action.payload,
        loading: false,
      };
    case constants.ACCOUNT_CREATION_FAILED:
      return {
        ...state,
        loading: false,
        accountCreationError: action.payload,
      };
    case constants.SAVE_PAYMENT_METHOD:
      return {
        ...state,
        paymentMethod: action.payload
      };
    case constants.SAVE_BLOCK_CHAIN:
      console.log(action.payload, 'saving blockChain')
      return {
        ...state,
        blockChain: action.payload,
      };
    case constants.ACCOUNT_FROM_DB:
      return {
        ...state,
        accountFromDb: action.payload
      };
    case constants.SET_PROCESS:
      return {
        ...state,
        process: action.payload
      };
    case constants.SAVE_RATES:
      return {
        ...state,
        rates: action.payload
      };
    case constants.PLAID_ERROR:
      return {
        ...state,
        plaidError: action.payload
      };
    case constants.SELL_TRANSACTION:
      return {
        ...state,
        sellTransaction: action.payload
      };
    case constants.BUY_TRANSACTION:
      return {
        ...state,
        buyTransaction: action.payload
      };
    default:
      return state;
  }
};

export default AccountReducer;
