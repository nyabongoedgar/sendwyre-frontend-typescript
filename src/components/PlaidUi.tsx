import * as React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import axios from "axios";
import toast from 'toastr';
//@ts-ignore
import { ThemedButton } from "unifyre-web-wallet-components";
import { RootState } from "../reducers";
import { SavePaymentMethod, SaveBlockChain, SetProcess, SetPlaidError } from '../actions/actionCreators'
import { WYRE_BACKEND_ENDPOINT } from '../urls';

const mapState = (state: RootState) => {
  return {
    createdWyreAccount: state.reducer.createdWyreAccount,
    paymentMethod: state.reducer.paymentMethod,
    blockChain: state.reducer.blockChain,
    userInfoFromDb: state.reducer.userInfoFromDb,
    unifyreUserProfile: state.reducer.unifyreUserProfile
  }
}

const connector = connect(mapState);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & { fetchUser: (userId: string) => void };

export function PlaidUi(props: Props) {

  const attachBlockChainTopaymentMethod = async (data: any) => {
    const paymentMethodId = data.paymentMethod.id;
    try {
      props.dispatch(SetProcess('Attaching BlockChain to Payment method'));
      const response = await axios.post(`${WYRE_BACKEND_ENDPOINT}/attachBlockChains`, {
        accountId: typeof props.userInfoFromDb.user.wyreAccount.id !== "undefined" && props.userInfoFromDb.user.wyreAccount.id || props.createdWyreAccount.response.id,
        paymentMethodId: paymentMethodId
      });
      props.dispatch(SaveBlockChain(response.data));
      props.dispatch(SetProcess(''));
      toast.success('Account set up successfully');
    } catch (error) {
      console.log(error, 'error in calling unifyre user')
      // toast.error(error.response.data.message, 'Plaid Error')
    }

  }

  const createPaymentMethod = async (publicToken: string) => {
    try {
      props.dispatch(SetProcess('Creating payment method'));
      const response = await axios.post(`${WYRE_BACKEND_ENDPOINT}/paymentMethods`, {
        //@ts-ignore
        publicToken: publicToken,
        accountId: typeof props.userInfoFromDb.user.wyreAccount.id !== "undefined" && props.userInfoFromDb.user.wyreAccount.id || props.createdWyreAccount.response.id
      });
      props.dispatch(SavePaymentMethod(response.data));
      return attachBlockChainTopaymentMethod(response.data);
    } catch (error) {
      props.dispatch(SetProcess(''));
      console.log(error, 'error occurred with payment method creation');
    }
  }

  // ** Note on WyrePMWidget the environment,env is set to test. Update that to prod if you're using it in production.
  // @ts-ignore
  let handler = new WyrePmWidget({
    env: "test",
    onSuccess: async function (result: any) {
      // Here you would forward the publicToken back to your server in order to  be shipped to the Wyre API
      await createPaymentMethod(result.publicToken);
      window.location.reload(false);
    },
    onExit: function (err: any) {
      if (err != null) {
        // The user encountered an error prior to exiting the module
        SetPlaidError(err)
      }
      console.log("Thingo exited:", err);
    }
  });

  return (
    <React.Fragment>
      <ThemedButton onPress={() => handler.open()} text={'Connect Bank Account'} />
    </React.Fragment>
  );
}

export default connector(PlaidUi)