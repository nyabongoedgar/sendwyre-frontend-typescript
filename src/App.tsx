import React from 'react';
import { connect } from 'react-redux';
import axios from "axios";
import PlaidUi from './components/PlaidUi';
import CreateAccount from './components/CreateAccount';
// import Transfer from './components/Trade';
import { CheckUserAccount } from './actions/accountActions';
//@ts-ignore
import { ThemedText } from 'unifyre-web-wallet-components';
import Router from './Router';

export class App extends React.Component<any, any> {

  componentDidMount() {
    (async () => {
      const response = await axios.get('http://localhost:3000/api/v1/users/40');
      console.log(response.data, 'user data');
      this.props.dispatch(CheckUserAccount(response.data));
    })();
  }
  render() {
      return (
        <div className='container'>
          <Router />
        </div>
      );
  }
}

const mapStateToProps = (state: any) => ({
  accountFromDb: state.accountReducer.accountFromDb
});

export default connect(mapStateToProps)(App);


//The whole object should get all the user data from mongodb, we can then display the the paymentmethods, every piece of the data along with it.