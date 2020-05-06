import React from 'react';
import { connect } from 'react-redux';
import axios from "axios";
import toast from 'toastr';
import Loader from './Loader';
import PlaidUi from './PlaidUi';
import CreateAccount from './CreateAccount';

//@ts-ignore
import { ThemedText, Gap } from 'unifyre-web-wallet-components';


export class LandingPage extends React.Component<any, any> {

    renderAccountInfo(){
        const {userInfoFromDb} = this.props;
        const wyreAccountStatus = userInfoFromDb.user.wyreAccount.status;
        const paymentMethodStatus = userInfoFromDb.user.paymentMethods[0].status;
        return(
            <React.Fragment>
                Account status: {wyreAccountStatus} <br />
                PaymentMethod Status: {paymentMethodStatus} 
            </React.Fragment>
            
        );
    }

    render() {
        const { userInfoFromDb, process, plaidError } = this.props;
        if (userInfoFromDb === null) {
            return <Loader />;
        }
        return (
            <React.Fragment>
                <Gap />
                {userInfoFromDb && userInfoFromDb.success === true ?

                    this.renderAccountInfo():

                    (<React.Fragment>
                        'You need to  create an account' <br />
                        <CreateAccount /> <br />
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
                    </React.Fragment>)

                }

            </React.Fragment>
        );
    }
}

const mapStateToProps = (state: any) => {
    return {
        userInfoFromDb: state.reducer.userInfoFromDb
    }
}
export default connect(mapStateToProps)(LandingPage);


//The whole object should get all the user data from mongodb, we can then display the the paymentmethods, every piece of the data along with it.