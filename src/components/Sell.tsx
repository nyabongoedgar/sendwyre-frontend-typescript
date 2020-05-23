import React from 'react';
import axios from "axios";
import { connect } from "react-redux";
import { UnifyreExtensionKitWeb } from 'unifyre-extension-sdk/dist/web/UnifyreExtensionKitWeb';
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

    async sendMoney(amountToSend: any, wyrePaymentMethodEthAddress: any) {
        const client = await UnifyreExtensionKitWeb.client();
        const res = await client.sendMoney(wyrePaymentMethodEthAddress, 'ETH', amountToSend);
        console.log('SEND MONEY RESPONSE: ', res);
        return res;
      }

    handleChange(event: any) {
        this.setState({ [event.target.name]: event.target.value });
    }

    async handleSellTransaction(sourceAmountToSell: any) {
        try {
            const {userInfoFromDb} = this.props;
            const paymentMethodEthAdress = userInfoFromDb && userInfoFromDb.user.paymentMethods[0].blockchains.ETH;
            this.props.dispatch(startAction({ sellTransactionLoading: true }));
            const response = await this.sendMoney(sourceAmountToSell, paymentMethodEthAdress,  )
            // const response = await axios.post('http://localhost:3000/api/v1/transfers', {
            //     accountId: userInfoFromDb && userInfoFromDb.user.wyreAccount.id,
            //     transaction: body
            // });
            this.props.dispatch(SetSellTransaction(response));
            toast.success('You have sold crypto successfully, wait for a few minute', 'Crypto Sold');
            await this.props.fetchUser(this.props.unifyreUserProfile.userId);
            return response;
        } catch (error) {
            this.props.dispatch(failedSellTransaction(error))
            toast.error(error, 'Sell Transaction failed');
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

        console.log(symbol, 'symbol', unifyreCurrency, 'unifyre currency', unifyreBalance, 'unifyreBalance', unifyreAddress, 'unifyreAddress',network, 'network');



        //correct, issue with source is given, this is because of permissions
        /* ideally, we need to send this money to the eth address of the wyre Account, then, we then use the account's eth address as source, so
        1. we send funds from unifyre to the wyre account
        2. we then send funds from the wyre Account to the payment method
        */



        // payment methods have blockChains
        let wyreAccountDepositAddresses = userInfoFromDb && userInfoFromDb.user.wyreAccount.depositAddresses;

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
                <ThemedButton text={`Sell ${symbol} `} onPress={() => this.handleSellTransaction(sourceAmountToSell)} disabled={this.props.sellTransactionLoading} />

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