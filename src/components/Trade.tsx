import React from 'react';
import axios from "axios";
import { connect } from "react-redux";
import Loader from './Loader';
//@ts-ignore
import { InputGroupAddon, ThemedButton, Gap } from 'unifyre-web-wallet-components';
import Buy from './Buy';
import Sell from './Sell';
import { SaveRates, SaveLimits, CheckUserAccount } from '../actions/actionCreators';

export class Trade extends React.Component<any, any>{
    constructor(props: any) {
        super(props);
        this.state = {showModal: false}
    }
    componentDidMount() {
        /**
         * get exchange rates and limits
         */
        (async () => {
            const rates = await axios.get("http://localhost:3000/api/v1/rates");
            const limits = await axios.get("http://localhost:3000/api/v1/limits");
            this.props.dispatch(SaveRates(rates.data))
            this.props.dispatch(SaveLimits(limits.data))
        })();
    }

    async fetchUser(userId: any) {
        const response = await axios.get(`http://localhost:3000/api/v1/users/${userId}`);
        this.props.dispatch(CheckUserAccount(response.data));
    }

    handleChange(event: any) {
        this.setState({ [event.target.name]: event.target.value });
    }



    render() {
        const { userInfoFromDb, action } = this.props;
        if (userInfoFromDb === null) {
            return <Loader color={'green'} type={'spin'} />
        }
        // if(userInfoFromDb.user.wyreAccount.status !== 'OPEN' || userInfoFromDb.user.paymentMethods[0].status === 'PENDING'){
        //     return 'You cannot transact yet, your account and payment method will be approved soon';
        // } //this will help us get users, who paymentmethod is not active
        return (
            <React.Fragment>
                <Gap />
                {
                    action === "buy" ?
                        <Buy fetchUser={this.fetchUser} handleChange={this.handleChange} /> :
                        <Sell fetchUser={this.fetchUser} handleChange={this.handleChange} />
                }
            </React.Fragment>
        );
    }

}

const mapStateToProps = (state: any) => {
    return {
        userInfoFromDb: state.reducer.userInfoFromDb,
        rates: state.reducer.rates,
        buyTransaction: state.reducer.buyTransaction,
        buyTransactionLoading: state.reducer.buyTransactionLoading,
        buyTransactionError: state.reducer.buyTransactionError,
        sellTransaction: state.reducer.sellTransaction,
        sellTransactionLoading: state.reducer.sellTransactionLoading,
        sellTransactionError: state.reducer.sellTransactionError,
        unifyreUserProfile: state.reducer.unifyreUserProfile
    }
}

export default connect(mapStateToProps)(Trade);