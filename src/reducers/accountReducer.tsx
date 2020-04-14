const intialState = {
  error: null,
  account: null,
  loading: false,
  paymentMethod: null,
  blockChain: null,
  accountFromDb: null,
  process: null,
  rates: null
};

const AccountReducer = (state = intialState, action: any) => {
  switch (action.type) {
    case 'STARTED':
      return {
        ...state,
        loading: true
      };
    case 'SUCCESSFUL':
      console.log('.............', action.payload)
      return {
        ...state,
        account: action.payload,
        loading: false,
      };
    case 'FAILED':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case 'SAVE_PAYMENT_METHOD':
      return {
        ...state,
        paymentMethod: action.payload
      };
    case 'SAVE_BLOCK_CHAIN':
      console.log(action.payload, 'saving blockChain')
      return {
        ...state,
        blockChain: action.payload,
      };
    case 'ACCOUNT_FROM_DB':
      return{
        ...state,
        accountFromDb: action.payload
      };
    case 'SET_PROCESS':
      return {
        ...state,
        process: action.payload
      };
    case 'SAVE_RATES':
      return {
        ...state,
        rates: action.payload
      }
    default:
      return state;
  }
};

export default AccountReducer;
