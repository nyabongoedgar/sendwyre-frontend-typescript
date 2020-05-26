import * as React from 'react';
import { connect } from 'react-redux';
import axios from "axios";
import toast from 'toastr';
//@ts-ignore
import { ThemedButton } from "unifyre-web-wallet-components";
import { SavePaymentMethod, SaveBlockChain, SetProcess, SetPlaidError } from '../actions/actionCreators'


export function PlaidUi(props: any) {

  const attachBlockChainTopaymentMethod = async (data: any) => {
    const paymentMethodId = data.paymentMethod.id;
    try {
      props.dispatch(SetProcess('Attaching BlockChain to Payment method'));
      const response = await axios.post('http://localhost:3000/api/v1/attachBlockChain', {
        accountId: typeof props.userInfoFromDb.user.wyreAccount.id !== "undefined" && props.userInfoFromDb.user.wyreAccount.id || props.createdWyreAccount.response.id,
        paymentMethodId: paymentMethodId
      });
      props.dispatch(SaveBlockChain(response.data));
      props.dispatch(SetProcess(''));
      toast.success('Account set up successfully');
      return response.data;
    } catch (error) {
      toast.error(error.response.data.message, 'Plaid Error')
    }

  }

  const createPaymentMethod = async (publicToken: string) => {
    try {
      console.log(props, 'props in create payment method')
      const response = await axios.post('http://localhost:3000/api/v1/paymentMethods', {
        //@ts-ignore
        publicToken: publicToken,
        accountId: typeof props.userInfoFromDb.user.wyreAccount.id !== "undefined" && props.userInfoFromDb.user.wyreAccount.id || props.createdWyreAccount.response.id
      });
      props.dispatch(SetProcess('Creating payment method'));
      props.dispatch(SavePaymentMethod(response.data));
      props.dispatch(SetProcess(''));
      return attachBlockChainTopaymentMethod(response.data);
    } catch (error) {
      console.log(error, 'payment method')
      // toast.error(error.response.data.message, 'Payment method creation failed');
    }

  }

  // ** Note on WyrePMWidget the environment,env is set to test. Update that to prod if you're using it in production.
  // @ts-ignore
  let handler = new WyrePmWidget({
    env: "test",
    onLoad: function () {
      // In this example we open the modal immediately on load. More typically you might have the handler.open() invocation attached to a button.
      // handler.open();
    },
    onSuccess: function (result: any) {
      // Here you would forward the publicToken back to your server in order to  be shipped to the Wyre API
      // console.log(result.public_token);
      console.log(result, 'result');
      console.log(props)
      createPaymentMethod(result.publicToken);
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
      <ThemedButton onPress={() => handler.open()} style={{backgroundColor: "white!important"}} text={'Connect Bank Account'} />
      <br />
      {props.paymentMethod ? `Payment method has been attached to your account: ${props.paymentMethod.paymentMethod.id}` : ''}
      <br />
      {props.paymentMethod ? `Payment method status: ${props.paymentMethod.paymentMethod.status}` : ''}
      <br />
      {/* blockChain Attached: {blockChain ? JSON.stringify(blockChain): 'No'} */}
      {/* <ThemedButton onPress={attachBlockChainTopaymentMethod} text={'AttachblockChain'} /> */}
      {/* {props.blockChain ? `BlockChainAttached ${JSON.stringify(props.blockChain)}` : ''} */}
    </React.Fragment>
  )

}
const mapStateToProps = (state: any) => {
  return {
    createdWyreAccount: state.reducer.createdWyreAccount,
    paymentMethod: state.reducer.paymentMethod,
    blockChain: state.reducer.blockChain,
    userInfoFromDb: state.reducer.userInfoFromDb
  }
}
export default connect(mapStateToProps)(PlaidUi)