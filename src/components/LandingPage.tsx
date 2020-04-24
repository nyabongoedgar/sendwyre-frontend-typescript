import React from 'react';
import { connect } from 'react-redux';
import axios from "axios";
import Loader from './Loader';
import PlaidUi from './PlaidUi';
import CreateAccount from './CreateAccount';
// import Transfer from './components/Trade';
import { CheckUserAccount, startAction, SetProcess, successAccountCreation, failedAccountCreation } from '../actions/accountActions';
//@ts-ignore
import { ThemedText, Gap } from 'unifyre-web-wallet-components';


export class LandingPage extends React.Component<any, any> {

    handleAccountCreation = async () => {
        try {
            this.props.dispatch(startAction());
            this.props.dispatch(SetProcess('Creating an account for you'));
            const response = await axios.post('http://localhost:3000/api/v1/accounts')
            this.props.dispatch(successAccountCreation(response.data));
            this.props.dispatch(SetProcess(''));
            return response.data;
        } catch (error) {
            this.props.dispatch(failedAccountCreation(JSON.stringify(error)));
            alert(JSON.stringify(error["message"]))
        }
    }
    render() {
        const { accountFromDb, process, plaidError } = this.props;
        if (accountFromDb === null) {
            return <Loader />;
        }
        return (
            <React.Fragment>
                <Gap />
                {accountFromDb && accountFromDb.success === true ? 'You have an account' :
                    (<React.Fragment>
                        'You need to  create an account' <br />
                        <CreateAccount />
                    </React.Fragment>)}
                <div>
                    <ThemedText.H3 text={'Steps to connect your bank account to Sendwyre'} />
                    <ol>
                        <li> We create an account for you. </li>
                        <li> You connect your account to your bank account </li>
                    </ol>

                    <hr />
                    {/* if false we create account for you and connect your bank account */}

                    <ThemedText.P text={'Connect your bank account'} />
                    <PlaidUi />
                    <div style={{ color: "green", textTransform: "uppercase" }}>
                        {!!process ? `${process}..........` : undefined}
                        {!!plaidError ? 'Error while connecting your bank account, Please try again' : undefined}
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state: any) => {
    return {
        loading: state.accountReducer.loading,
        account: state.accountReducer.account,
        accountCreationError: state.accountReducer.error,
        accountFromDb: state.accountReducer.accountFromDb,
        process: state.accountReducer.process,
        plaidError: state.accountReducer.plaidError
    }
}
export default connect(mapStateToProps)(LandingPage);


//The whole object should get all the user data from mongodb, we can then display the the paymentmethods, every piece of the data along with it.