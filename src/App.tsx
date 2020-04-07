import React from 'react';
import {connect} from 'react-redux';
import axios from "axios";
import PlaidUi from './components/PlaidUi';
import CreateAccount from './components/CreateAccount';
import {CheckUserAccount} from './actions/accountActions';
const {ThemedButton} = require('unifyre-web-wallet-components');


export function App(props: any) {
  console.log('App js props', props)
  React.useEffect(() => {
    const getUserAccountInfo = async () => (await axios.get('http://localhost:3000/api/v1/accounts'));
    getUserAccountInfo()
      .then(response => {
        props.dispatch(CheckUserAccount(response.data))})
        .catch((error: any) => console.log(error))
  }, []);

  return (
    <React.Fragment>
      <h1>Unifyre Sendwyre</h1>
      <ThemedButton text={'Cruel'} />
      <p>Steps to connect your bank account to Sendwyre</p>
      <ol>
        <li>Create an account</li>
        <CreateAccount />
        <hr />
        <li>Connect your bank account</li>
        {/* <PlaidUi /> */}
      </ol>
    {props.accountFromDb && props.accountFromDb.message=== "Account not found" ? alert('You need an account') : '' }

    </React.Fragment>

  );
}

const mapStateToProps = (state: any) => {
  return {
    loading: state.accountReducer.loading,
    account: state.accountReducer.account,
    error: state.accountReducer.error,
    accountFromDb: state.accountReducer.accountFromDb
  }
}
export default connect(mapStateToProps)(App);
