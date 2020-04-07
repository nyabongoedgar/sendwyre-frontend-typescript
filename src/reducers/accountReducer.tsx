const intialState = {
  error: null,
  account: null,
  loading: false,
  paymentMethod: null,
  blockChain: null,
  accountFromDb: null
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
        paymentMethod: action.payload,
      }
    case 'SAVE_BLOCK_CHAIN':
      return {
        ...state,
        blockChain: action.payload,
      }
    case 'ACCOUNT_FROM_DB':
      console.log(action.payload, '>>>>>>>>>>>>>>>>>')
      return{
        ...state,
        accountFromDb: action.payload
      }

    default:
      return state;
  }
};

export default AccountReducer;
