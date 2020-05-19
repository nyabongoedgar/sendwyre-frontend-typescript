import React from 'react';
import axios from "axios";
import { connect } from "react-redux";
import toast from 'toastr';
import Loader from './Loader';
//@ts-ignore
import { InputGroupAddon, ThemedButton, Gap } from 'unifyre-web-wallet-components';
import { SetSellTransaction, startAction, failedSellTransaction } from '../actions/actionCreators';


export class Sell extends React.Component<any, any>{
    constructor(props: any) {
        super(props);
        this.state = {
            sourceAmountToSell: 0
        }
    }

    async handleSellTransaction(body: any) {
        try {
            const {userInfoFromDb} = this.props;
            this.props.dispatch(startAction({ sellTransactionLoading: true }));
            const response = await axios.post('http://localhost:3000/api/v1/transfers', {
                accountId: userInfoFromDb && userInfoFromDb.user.wyreAccount.id,
                transaction: body
            });
            this.props.dispatch(SetSellTransaction(response.data));
            toast.success('You have sold crypto successfully, wait for a few minute', 'Crypto Sold');
            await this.props.fetchUser(this.props.unifyreUserProfile.userId);
            return response.data;
        } catch (error) {
            this.props.dispatch(failedSellTransaction(error))
            toast.error(error.response.data.message, 'Sell Transaction failed');
        }
    }

    //for sell, we shall send to the account's payment method

    renderSellComponent() {
        // this is from unifyre to your bank account
        const { userInfoFromDb } = this.props;
        // let accountId = userInfoFromDb && userInfoFromDb.user.wyreAccount.id;
        // let paymentmethodSRN = userInfoFromDb && userInfoFromDb.user.paymentMethods[0].srn;
        let fundsSource = '';
        let paymentmethodSRN = userInfoFromDb && userInfoFromDb.user.paymentMethods[0].srn; //we must tell them to connect a payment Method

        const { sourceAmountToSell } = this.state;
        // You can now sell your BTC, ETH, or DAI and have cash deposited directly into your bank account.
        const rates = this.props.rates && this.props.rates.rates;
        const BTC_to_USD = rates && rates.BTCUSD.USD;
        const ETH_to_USD = rates && rates.ETHUSD.USD;
        const { addresses } = this.props.unifyreUserProfile.accountGroups[0];
        const { symbol, currency: unifyreCurrency, balance: unifyreBalance, address: unifyreAddress, network } = addresses[0];
        let transaction = { /*source: `${network.toLowerCase()}:${unifyreAddress}` */ source: 'ethereum:0x415C07a820B30080d531048b589Fe27910e00639', sourceCurrency: symbol, sourceAmount: sourceAmountToSell, /* "dest": `${paymentmethodSRN}:ach*/ dest: "0xdb5435feebd064bdee1c841158e14d235d0fa6ff", destCurrency: "ETH" || "USD", autoConfirm: true };
        console.log(transaction)
        return (
            <React.Fragment>
                <h1>Sell {symbol}</h1>
                {/* <label>
                    I want to sell
                <select name='currencyToSell' value={currencyToSell} onChange={(e) => this.handleChange(e)}>
                        <option value="BTC">BTC</option>
                        <option value="ETH">ETH</option>
                        <option value="DAI">DAI</option>
                    </select>
                </label> */}
                <br />
                Amount to sell: <br />
                <input type="number" name="sourceAmountToSell" value={sourceAmountToSell} placeholder='Amount to sell' max={unifyreBalance} min={0} onChange={e => this.props.handleChange(e)} />
                <br />
                Your unifyre Balance: {`${unifyreBalance} ${symbol}`}
                <br />
                USD Equivalent: {symbol === 'BTC' ? (BTC_to_USD * sourceAmountToSell) : (ETH_to_USD * sourceAmountToSell)} usd
                <br />
                <ThemedButton text={`Sell ${symbol} `} onPress={() => this.handleSellTransaction(transaction)} disabled={this.props.sellTransactionLoading} />
            </React.Fragment>
        )
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
                {this.renderSellComponent()}
            </React.Fragment>
        );
    }

}

const mapStateToProps = (state: any) => {
    return {
        userInfoFromDb: state.reducer.userInfoFromDb,
        rates: state.reducer.rates, //these must be different from buy
        sellTransaction: state.reducer.sellTransaction,
        sellTransactionLoading: state.reducer.sellTransactionLoading,
        sellTransactionError: state.reducer.sellTransactionError,
        unifyreUserProfile: state.reducer.unifyreUserProfile
    }
}

export default connect(mapStateToProps)(Sell);