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

    handleChange(event: any) {
        this.setState({ [event.target.name]: event.target.value });
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
        let paymentMethodblockChains = userInfoFromDb && userInfoFromDb.user.paymentMethods[0].blockchains;

        console.log(paymentMethodblockChains, 'paymentMethod blockChains')
        // let wyreAccountCrypto = userInfoFromDb && userInfoFromDb.user.wyreAccount.;
        let paymentmethodSRN = userInfoFromDb && userInfoFromDb.user.paymentMethods[0].srn; //we must tell them to connect a payment Method
        console.log(paymentmethodSRN, 'paymentMethod SRN');
        const { sourceAmountToSell } = this.state;
        // You can sell your BTC, ETH, or DAI and have cash deposited directly into your bank account.
        const rates = this.props.rates && this.props.rates.rates;
        //ethusd is the selling rate
        const ETH_to_USD = rates && rates.ETHUSD || 'loading indicative price';
        console.log(rates, 'sell');
        const { addresses } = this.props.unifyreUserProfile.accountGroups[0];
        const { symbol, currency: unifyreCurrency, balance: unifyreBalance, address: unifyreAddress, network } = addresses[0];
        let transaction = { /*source: `${network.toLowerCase()}:${unifyreAddress}` */ source: 'ethereum:0x415C07a820B30080d531048b589Fe27910e00639', sourceCurrency: symbol, sourceAmount: sourceAmountToSell, /* "dest": `${paymentmethodSRN}:ach*/ dest: "0xdb5435feebd064bdee1c841158e14d235d0fa6ff", destCurrency: "ETH" || "USD", autoConfirm: true };
        console.log(transaction);

        let testTransForError = {
            source: "ethereum: 0x415C07a820B30080d531048b589Fe27910e00639",
            sourceCurrency: "ETH",
            sourceAmount: 0.0003,
            dest: "ethereum:0x415C07a820B30080d531048b589Fe27910e00639",
            autoConfirm: true
        }

        //correct, issue with source is given, this is because of permissions
        /* ideally, we need to send this money to the eth address of the wyre Account, then, we then use the account's eth address as source, so
        1. we send funds from unifyre to the wyre account
        2. we then send funds from the wyre Account to the payment method
        */

        let realTransactionInFuture = {
            source: `${symbol}:${unifyreAddress}`,
            sourceCurrency: `${symbol}`,
            sourceAmount: sourceAmountToSell,
            autoConfirm: true,
            amountIncludeFees: true
        }
        console.log(realTransactionInFuture, 'real transaction in future')
        // payment methods have blockChains
        let wyreAccountDepositAddresses = userInfoFromDb && userInfoFromDb.user.wyreAccount.depositAddresses;
        console.log(wyreAccountDepositAddresses, 'main gut')
        let idealTransaction = {
            source: wyreAccountDepositAddresses.ETH /** here we need to probably pull our very own account address */,
            sourceCurrency: 'ETH',
            dest: paymentMethodblockChains.ETH,
            destCurrency: 'ETH',
            sourceAmount: sourceAmountToSell
        }

        console.log(idealTransaction, 'ideal >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
        return (
            <React.Fragment>
                <h1>Sell {symbol}</h1>
                <br />
                Amount to sell: <br />
                <input type="number" name="sourceAmountToSell" value={sourceAmountToSell} placeholder='Amount to sell' max={unifyreBalance} min={0} onChange={e => this.handleChange(e)} />
                <br />
                Your unifyre Balance: {`${unifyreBalance} ${symbol}`}
                <br />
                Indicative price : 1 ETH = {`${ETH_to_USD} USD`}
                <br />
                {/* <ThemedButton text={`Sell ${symbol} `} onPress={() => this.handleSellTransaction(transaction)} disabled={this.props.sellTransactionLoading} /> */}
                <ThemedButton text={`Sell ${symbol} `} onPress={() => this.handleSellTransaction(testTransForError)} disabled={this.props.sellTransactionLoading} />

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