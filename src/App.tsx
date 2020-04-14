import React from 'react';
import { connect } from 'react-redux';
import axios from "axios";
import PlaidUi from './components/PlaidUi';
import CreateAccount from './components/CreateAccount';
import Transfer from './components/Transfer';
import { CheckUserAccount } from './actions/accountActions';
//@ts-ignore
import { ThemedText } from 'unifyre-web-wallet-components';

export class App extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  componentDidMount() {
    (async () => {
      const response = await axios.get('http://localhost:3000/api/v1/accounts')
      this.props.dispatch(CheckUserAccount(response.data));
    })();
  }
  render() {
    const {accountFromDb, process} = this.props;
    return (
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}>
        <div style={{
          backgroundColor: "#26c97a",
          color: "black",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-evenly",
          fontSize: "22px",
          padding: "20px"
        }}>
          <ThemedText.H1 text={'Unifyre Sendwyre'} />
        </div>


        <ThemedText.H3 text={'Steps to connect your bank account to Sendwyre'} />
        <ol>
          <li><ThemedText.P text={'Create an account'} /> </li>
          <CreateAccount />
          <hr />
          <li><ThemedText.P text={'Connect your bank account'} /> </li>
          <PlaidUi />
        </ol>
        {accountFromDb && accountFromDb.message === "Account not found" ? alert('You need an account') : ''}

        <div style={{ color: "green", transform: "uppercase" }}>
          {!!process ? `${process}..........` : undefined}
        </div>
        <Transfer />
      </div>

    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    loading: state.accountReducer.loading,
    account: state.accountReducer.account,
    error: state.accountReducer.error,
    accountFromDb: state.accountReducer.accountFromDb,
    process: state.accountReducer.process
  }
}
export default connect(mapStateToProps)(App);


//The whole object should get all the user data from mongodb, we can then display the the paymentmethods, every piece of the data along with it.