import * as React from 'react';
import {connect} from 'react-redux';
import axios from "axios";
import {SavePaymentMethod, SaveBlockChain} from '../actions/accountActions'
import { stat } from 'fs';

export function PlaidUi(props: any) {
  // const [result, setResult] = React.useState();
  // const [paymentMethod, setPaymentMethod] = React.useState(undefined);
  // const [blockChain, setBlockChain] = React.useState(undefined);

  const attachBlockChainTopaymentMethod = async () => {
    const response = await axios.post('http://localhost:3000/api/v1/attachBlockChain')
      .then(response => SaveBlockChain(response.data))
      .catch(err => console.log(err))
    return response;
  }

  const createPaymentMethod = async (publicToken: string) => {
    const response = await axios.post('http://localhost:3000/api/v1/paymentMethods', {
      //@ts-ignore
      publicToken: publicToken,
      accountId: props.account.response.id
    })
      .then(response => props.dispatch(SavePaymentMethod(response.data)))
      .catch(err => console.log(err));
    return response;
  };

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
      }
      console.log("Thingo exited:", err);
    }
  });

  return (
    <React.Fragment>
      <button onClick={() => handler.open()}>Connect Bank Account</button>
      <br />
      {props.paymentMethod ? `Payment method has been attached to your account: ${props.paymentMethod.paymentMethod.id}` : ''}
      <br />
      {props.paymentMethod ? `Payment method status: ${props.paymentMethod.paymentMethod.status}` : ''}
      <br />
      {/* blockChain Attached: {blockChain ? JSON.stringify(blockChain): 'No'} */}
      <button onClick={attachBlockChainTopaymentMethod}>AttachblockChain</button>
      {props.blockChain? `BlockChainAttached ${JSON.stringify(props.blockChain)}` : ''}
    </React.Fragment>
  )

}
const mapStateToProps = (state: any) => {
  return {
    account: state.accountReducer.account,
    paymentMethod: state.accountReducer.paymentMethod,
    blockChain: state.accountReducer.blockChain
  }
}
export default connect(mapStateToProps)(PlaidUi)