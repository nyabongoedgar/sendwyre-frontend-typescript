import React from 'react';
import axios from "axios";
import { connect } from "react-redux";
import toast from 'toastr';
import Loader from './Loader';
//@ts-ignore
import { InputGroupAddon, ThemedButton, Gap } from 'unifyre-web-wallet-components';
import { SaveRates, SaveLimits, SetBuyTransaction, failedBuyTransaction , SetSellTransaction, startAction, failedSellTransaction } from '../actions/actionCreators';

export class Trade extends React.Component<any, any>{
    constructor(props: any) {
        super(props);
        this.state = {
            currencyToBuy: 'BTC',
            sourceAmount: 0,
            currencyToSell: 'BTC',
            sourceAmountToSell: 0,
            action: "buy crypto"
        }
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

    handleChange(event: any) {
        this.setState({ [event.target.name]: event.target.value });
    }

    async handleBuyTransaction(body: any, accountId: string) {
        try {
            this.props.dispatch(startAction({buyTransactionLoading: true}))
            const response = await axios.post('http://localhost:3000/api/v1/transfers', {
                accountId,
                body
            });
            this.props.dispatch(SetBuyTransaction(response.data));
            toast.success('You have bought crypto success, wait for a few minute', 'Crypto Purchase')
            return response.data;
        } catch (error) {
            this.props.dispatch(failedBuyTransaction(error));
            toast.error(error.response.data.message, 'Crypto Purchase failed');
        }
    }

    async handleSellTransaction(body: any, accountId: string) {
        try {
            this.props.dispatch(startAction({sellTransactionLoading: true}));
            const response = await axios.post('http://localhost:3000/api/v1/transfers', {
                accountId,
                body
            });
            this.props.dispatch(SetSellTransaction(response.data));
            toast.success('You have sold crypto successfully, wait for a few minute', 'Crypto Sold')
            return response.data;
        } catch (error) {
            this.props.dispatch(failedSellTransaction(error))
            toast.error(error.response.data.message, 'Sell Transaction failed');
        }
    }

    renderBuyComponent() {
        const { currencyToBuy, sourceAmount } = this.state;
        const {userInfoFromDb} = this.props;
        let fundsSource = userInfoFromDb && userInfoFromDb.user.paymentMethods[0].srn;
        let accountId = this.props.userInfoFromDb && this.props.userInfoFromDb.user.wyreAccount.id;
        console.log(fundsSource, 'funds source');
        console.log(accountId);
        const rates = this.props.rates && this.props.rates.rates;
        console.log(rates);
        const whatYouGetInBTC = rates ? Number((1 / rates.BTCUSD.USD) * sourceAmount) : 0;
        const whatYouGetInETH = rates ? Number((1 / rates.ETHUSD.USD) * sourceAmount) : 0;
        let key = `${currencyToBuy === 'BTC' ? 'bitcoin' : 'ethereum'}`
        let cryptoBody = { source: `${fundsSource}:ach`, sourceCurrency: "USD", sourceAmount: sourceAmount, "dest":`${fundsSource}:ach`, destCurrency: `${currencyToBuy}`, autoConfirm: true, amountIncludeFees: true };
        // let cryptoBody = {
        //     "source":"ethereum:0xdb5435feebd064bdee1c841158e14d235d0fa6ff",
        //     "sourceCurrency":"ETH","sourceAmount":"0.00004","dest":"bitcoin:mzEx8yaQiRjf4vHErJWKeTucYevyF4TkWg",
        //     "destCurrency":"BTC","message":"Sending the some eth to btc",
        //     "autoConfirm": true
        // };

        const BTC_to_USD = rates && `${rates.BTCUSD.BTC} USD`;
        const ETH_to_USD = rates && `${rates.ETHUSD.ETH} USD`;

        return (
            <React.Fragment>
                <h1>Buy</h1>
                <label>
                    I want to buy
                <select name='currencyToBuy' value={currencyToBuy} onChange={(e) => this.handleChange(e)}>
                        <option value="BTC">BTC</option>
                        <option value="ETH">ETH</option>
                    </select>
                </label>
                <br />

                I want to spend:   Maximum($2500) <br />

                <input type="number" name="sourceAmount" value={sourceAmount} onChange={(e: any) => this.handleChange(e)} placeholder={'Amount to buy'} min={0} />
                <br />
                Indicative price: 1 {currencyToBuy} =  {BTC_to_USD && ETH_to_USD ? (currencyToBuy === 'BTC' ? BTC_to_USD : ETH_to_USD) : 'loading'}
                <br />
                fee :
                <br />
                You will receive: {currencyToBuy === 'BTC' ? `${whatYouGetInBTC} BTC` : `${whatYouGetInETH} ETH`}
                <br />
                Pay with:
                <ThemedButton text={`Buy ${currencyToBuy} `} onPress={() => this.handleBuyTransaction(cryptoBody, accountId)} disabled={this.props.buyTransactionLoading} />
            </React.Fragment>)
    };
    //for sell, we shall send to the account's payment method

    renderSellComponent() {
        const {userInfoFromDb} = this.props;
        let accountId = userInfoFromDb && userInfoFromDb.user.wyreAccount.id;
        let paymentmethodSRN = userInfoFromDb && userInfoFromDb.user.paymentMethods[0].srn;
        const { currencyToSell, sourceAmountToSell } = this.state;
        // You can now sell your BTC, ETH, or DAI and have cash deposited directly into your bank account. 
        const rates = this.props.rates && this.props.rates.rates;
        let cryptoBody = { source: `${paymentmethodSRN}:ach`, sourceCurrency: currencyToSell, sourceAmount: sourceAmountToSell, "dest": `${paymentmethodSRN}:ach`, destCurrency: "USD", autoConfirm: true };
        const BTC_to_USD = rates && rates.BTCUSD.USD;
        const ETH_to_USD = rates && rates.ETHUSD.USD;
        return (
            <React.Fragment>
                <h1>Sell</h1>
                <label>
                    I want to sell
                <select name='currencyToSell' value={currencyToSell} onChange={(e) => this.handleChange(e)}>
                        <option value="BTC">BTC</option>
                        <option value="ETH">ETH</option>
                        <option value="DAI">DAI</option>
                    </select>
                </label>
                <br />
                Amount to sell: <br />
                <input type="number" name="sourceAmountToSell" value={sourceAmountToSell} placeholder='Amount to sell' onChange={e => this.handleChange(e)} />
                <br />
                USD Equivalent: {currencyToSell === 'BTC' ? (BTC_to_USD * sourceAmountToSell) : (ETH_to_USD * sourceAmountToSell)} usd
                <br />
                <ThemedButton text={`Sell ${currencyToSell} `} onPress={() => this.handleSellTransaction(cryptoBody, accountId)} disabled={this.props.sellTransactionLoading} />
            </React.Fragment>
        )
    }

    render() {
        const {action} =  this.state;
        const {userInfoFromDb} = this.props;
        if(userInfoFromDb === null){
            return <Loader color={'green'} type={'spin'} />
        } 
        // if(userInfoFromDb.user.wyreAccount.status !== 'OPEN' || userInfoFromDb.user.paymentMethods[0].status === 'PENDING'){
        //     return 'You cannot transact yet, your account and payment method will be approved soon';
        // } //this will help us get users, who paymentmethod is not active
        return (
            <React.Fragment>
                <Gap />
                What kind of transaction to you want to do?
                <select value={action} name="action" onChange={e => this.handleChange(e)}>
                    <option value="buy crypto">Buy</option>
                    <option value="Sell crypto">Sell</option>
                </select>
                <br />
            {action === "buy crypto" ? this.renderBuyComponent() : this.renderSellComponent()}
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
        sellTransactionError: state.reducer.sellTransactionError
    }
}

export default connect(mapStateToProps)(Trade);