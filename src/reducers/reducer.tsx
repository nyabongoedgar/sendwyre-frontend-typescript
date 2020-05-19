import * as constants from '../constants';
import { StoreState } from '../types';

const intialState = {
  createdWyreAccount: null,
  createWyreAccountLoading: false,
  accountCreationError: null,
  paymentMethod: null,
  blockChain: null,
  userInfoFromDb: null,
  process: '',
  rates: null,
  limits: null,
  plaidError: null,
  buyTransaction: null,
  buyTransactionLoading: false,
  buyTransactionError: null,
  sellTransaction: null,
  sellTransactionLoading: false,
  sellTransactionError: null,
  unifyreUserProfile: null,
  transferQuote: null
};

const reducer = (state: StoreState = intialState, action: any): StoreState => {
  switch (action.type) {
    case constants.START_ACTION:
      return {
        ...state,
        ...action.payload
      };

    case constants.SAVE_CREATED_ACCOUNT:
      return {
        ...state,
        createdWyreAccount: action.payload,
        createWyreAccountLoading: false,
      };

    case constants.ACCOUNT_CREATION_FAILED:
      return {
        ...state,
        createWyreAccountLoading: false,
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
        userInfoFromDb: action.payload
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

    case constants.SAVE_LIMITS:
      return {
        ...state,
        limits: action.payload
      };

    case constants.PLAID_ERROR:
      return {
        ...state,
        plaidError: action.payload
      };

    case constants.SELL_TRANSACTION:
      return {
        ...state,
        sellTransaction: action.payload,
        sellTransactionLoading: false
      };

    case constants.SELL_TRANSACTION_ERROR:
      return {
        ...state,
        sellTransactionError: action.payload,
        sellTransactionLoading: false
      }

    case constants.BUY_TRANSACTION:
      return {
        ...state,
        buyTransaction: action.payload,
        buyTransactionLoading: false
      };

    case constants.BUY_TRANSACTION_ERROR:
      return {
        ...state,
        buyTransactionError: action.payload,
        buyTransactionLoading: false
      };

      case constants.SAVE_UNIFYRE_USER_PROFILE:
        return {
          ...state,
          unifyreUserProfile : action.payload
        }

      case constants.SAVE_TRANSFER_QUOTE:
        return {
          ...state,
          transferQuote: action.payload

        }
    default:
      return state;
  }
};

export default reducer;
