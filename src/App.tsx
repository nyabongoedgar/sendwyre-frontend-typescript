import React from 'react';
import { UnifyreExtensionKitWeb } from 'unifyre-extension-sdk/dist/web/UnifyreExtensionKitWeb';
import { connect, ConnectedProps } from 'react-redux';
import axios from "axios";
import toast from 'toastr';
import { RootState } from "./reducers";
//@ts-ignore
import { Gap } from 'unifyre-web-wallet-components';
import Loader from './components/Loader';
import History from './components/History';
import Trade from './components/Trade';
import PlaidUi from './components/PlaidUi';
import './customStyles/toast.scss';
import './customStyles/modal.scss';
import { CheckUserAccount, startAction, SetProcess, successAccountCreation, failedAccountCreation, saveUnifyreUserProfile } from './actions/actionCreators';

type AppState = {
  signedIn: boolean, setAddress: any, balance: any, currency: any, userId: any, name: any, showWyre: boolean, wait: any, err: any
}

const mapState = (state: RootState) => {
  return {
    userInfoFromDb: state.reducer.userInfoFromDb,
    process: state.reducer.process,
    unifyreUserProfile: state.reducer.unifyreUserProfile,
  }
}

const connector = connect(mapState);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux;

export class App extends React.Component<Props, AppState> {

  constructor(props: any) {
    super(props);
    this.state = { signedIn: false, setAddress: '', balance: 'Unknown', currency: '', userId: '', name: '', showWyre: false, wait: '', err: '' }
  }

  async fetchUser(userId: any) {
    const response = await axios.get(`http://localhost:3000/api/v1/users/${userId}`);
    this.props.dispatch(CheckUserAccount(response.data));
  }

  /**
   * Connect to unifyre, get user info, create account automatically, ask user to connect bank account there and then
   */
  async componentDidMount() {
    // const ENDPOINT = 'http://localhost:9000/api/';
    // const ENDPOINT = 'http://localhost:3002/api/';
    const ENDPOINT = 'https://ube.ferrumnetwork.io/api/';
    const c = await UnifyreExtensionKitWeb.initialize('WYRE_WIDGET', ENDPOINT);
    // console.log('INIT RES?', c, UnifyreExtensionKitWeb._container);
    const token = (new URL(document.location.href)).searchParams.get("token");
    console.log(token);
    if (token) {
      const client = await UnifyreExtensionKitWeb.client();
      try {
        await client.signInWithToken(token);
        console.log(client, 'After sign in')
        const user = client.getUserProfile();
        this.props.dispatch(saveUnifyreUserProfile(user))
        console.log('GOT USER PROFILE ', user);
        const addr = user.accountGroups[0].addresses[0].addressWithChecksum;
        //@ts-ignore
        const cur = user.accountGroups[0].addresses[0].symbol;
        const bal = user.accountGroups[0].addresses[0].balance;
        this.setState({ signedIn: true, setAddress: addr, balance: bal, currency: cur, userId: user.userId }, async () => {
          const { name } = this.state;
          await this.fetchUser(user.userId);
          const { userInfoFromDb } = this.props;
          if (userInfoFromDb === null || userInfoFromDb.success === false) {
            const accountDetails = { "type": "INDIVIDUAL", "country": "US", "subaccount": true, "profileFields": [{ "fieldId": "individualLegalName", "value": `${user.displayName} ${user.displayName}` }, { "fieldId": "individualEmail", "value": user.email }, /*{ "fieldId": "individualResidenceAddress", "value": { "street1": "1 Market St", "street2": "Suite 402", "city": "San Francisco", "state": "CA", "postalCode": "94105", "country": "US" }  } */] }
            let accountBody = {
              accountDetails,
              userId: user.userId
            };
            //this function below will have the account creation object, we shall pick them from state
            this.handleAccountCreation(accountBody, user.userId);
          }
        });
        console.log('SIGN IN RES');
      } catch (e) {
        console.error(e);
        toast.error(e, 'Authentication Error');
        this.setState({ err: e });
      }
    }
  }

  renderComponentsForVerifiedUser() {
    const { userInfoFromDb } = this.props;
    const wyreAccountStatus = userInfoFromDb.user && userInfoFromDb.user.wyreAccount.status;
    const paymentMethodStatus = userInfoFromDb.user && userInfoFromDb.user.paymentMethods[0].status;
    const { unifyreUserProfile } = this.props;
    if (unifyreUserProfile !== null) {
      if (wyreAccountStatus === 'OPEN') {
        return (
          <React.Fragment>
            <p>Account Status : {wyreAccountStatus}</p> {/* we have this one page Trade / History */}
            {paymentMethodStatus === 'APPROVED' ?
              <p>You can also transact with your payment method</p> :
              <p>{`Your bank account is connected payment method is in status ${paymentMethodStatus}`}</p>}
            <Trade action={'buy'} />
            <Gap />
            <History />
          </React.Fragment>
        );
      }
      return 'Account not yet open for transacting';
    }
    return <Loader />
  }

  renderPlaidUI() {
    const { userInfoFromDb } = this.props;
    const paymentMethodStatus = userInfoFromDb.user && userInfoFromDb.user.paymentMethods[0].status;
    const paymentMethod = userInfoFromDb.user && userInfoFromDb.user.paymentMethods;
    console.log(paymentMethodStatus, typeof paymentMethodStatus, 'payment method info');
    return (
      <React.Fragment>
        {!paymentMethod.length ?
          (<div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "black",
            color: "white",
            borderRadius: "10px"
          }}
          >
            <PlaidUi />
            <p><em>Connect your bank account to be able to use it to buy crypto and also send money to it</em></p>
          </div>) : undefined
        }
      </React.Fragment>
    );
  }

  handleAccountCreation = async (body: any, userId: string) => {
    try {
      this.props.dispatch(startAction({ createWyreAccountLoading: true }));
      this.props.dispatch(SetProcess('Creating an account for you'));
      const response = await axios.post('http://localhost:3000/api/v1/accounts', body)
      this.props.dispatch(successAccountCreation(response.data));
      toast.success('Account Created');
      this.props.dispatch(SetProcess(''));
      await this.fetchUser(userId);
      return response.data;
    } catch (error) {
      this.props.dispatch(failedAccountCreation(JSON.stringify(error.response.data)));
      toast.error(error.response.data.message);
    }
  }

  render() {
    const { userInfoFromDb, process } = this.props;
    if (userInfoFromDb === null) {
      return <Loader />
    }
    return (
      <div className='container'>
        {this.renderPlaidUI()}
        {this.renderComponentsForVerifiedUser()}
        {!!process ? process : undefined}
      </div>
    );
  }
}

export default connector(App);