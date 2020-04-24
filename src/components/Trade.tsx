import React from 'react';
import axios from "axios";
import { connect } from "react-redux";
import Loader from './Loader';
//@ts-ignore
import { InputGroupAddon, ThemedButton, Gap } from 'unifyre-web-wallet-components';
import { SaveRates, SetBuyTransaction, SetSellTransaction } from '../actions/accountActions';

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
        //get rates, we need to have account data such as tehe unifyre, crypto value
        (async () => {
            const response = await axios.get("http://localhost:3000/api/v1/rates");
            this.props.dispatch(SaveRates(response.data));
        })();
    }

    handleChange(event: any) {
        this.setState({ [event.target.name]: event.target.value });
    }

    async handleBuyTransaction(body: any, accountId: string) {
        try {
            // const { sourceAmount, currencyToBuy } = this.state;
            // let body = { source: "account:AC_YNWFWXDW3AG", sourceCurrency: "USD", sourceAmount: sourceAmount, "dest": `${currency}:`, destCurrency: "USD", autoConfirm: true };
            // const accountId = this.props.accountFromDb && this.props.accountFromDb.wyreAccount.id;
            console.log(this.props.accountFromDb)
            const response = await axios.post('http://localhost:3000/api/v1/transfers', {
                accountId,
                body
            });
            this.props.dispatch(SetBuyTransaction(response.data));
            return response.data;
            // dest : we should append an address on dest, this will come from the global state object.
        } catch (error) {
            console.log(error, 'error in handle buy transaction')
            alert(JSON.stringify(error))
        }
    }

    async handleSellTransaction(body: any, accountId: string) {
        try {
            // const { sourceAmount, currencyToBuy } = this.state;
            // let body = { source: "account:AC_YNWFWXDW3AG", sourceCurrency: "USD", sourceAmount: sourceAmount, "dest": `${currency}:`, destCurrency: "USD", autoConfirm: true };
            const response = await axios.post('http://localhost:3000/api/v1/transfers', {
                accountId,
                body
            });
            this.props.dispatch(SetSellTransaction(response.data));
            return response.data;
            // dest : we should append an address on dest, this will come from the global state object.
        } catch (error) {
            throw new Error(error);
        }
    }

    // availableBalances	A map of the total amount of funds available to be withdrawn immediately from the account. If you are performing a check to see if the account has sufficient funds before making a withdrawal, you should check this balance.
    // payment methods available on the account to make digital currency purchases
    buy() {
        // Buying ETH with my bank account is technically just a transfer from my bank account to my ETH wallet.
        const {accountFromdb} = this.props;
        // let fundsSource = accountFromdb && accountFromdb.response.paymentMethods[0].id;
        let fundsSource = this.props.accountFromDb && this.props.accountFromDb.response.paymentMethods.srn;
        let accountId = this.props.accountFromDb && this.props.accountFromDb.response.wyreAccount.id;
        // console.log(this.props.accountFromDb && this.props.accountFromDb.response.paymentMethods.srn , 'fundsurce')
        console.log(accountId)
        const { currencyToBuy, sourceAmount } = this.state;
        // the funds source will be the bank account payment method
        // the dest will be unifyre's eth and btc accounts
        // let cryptoBody = { source: "paymentmethod:PA-M6YW788BCWN:ach", /* note the :ach on the end of the payment method. */, sourceCurrency: "USD", sourceAmount: sourceAmount, "dest": "ethereum:0x72867Ae42Cd662Beaa4d237694061BD1c7a6Ec02", destCurrency: "USD", autoConfirm: true, "amountIncludeFees": true, };
        const rates = this.props.rates && this.props.rates.rates;
        console.log(rates);
        const whatYouGetInBTC = rates ? Number((1 / rates.BTCUSD.USD) * sourceAmount) : 0;
        const whatYouGetInETH = rates ? Number((1 / rates.ETHUSD.USD) * sourceAmount) : 0;
        let key = `${currencyToBuy === 'BTC' ? 'bitcoin' : 'ethereum'}`
        // let cryptoBody = { source: `${fundsSource}:ach`, sourceCurrency: "USD", sourceAmount: sourceAmount, "dest":"bitcoin:14CriXWTRoJmQdBzdikw6tEmSuwxMozWWq", destCurrency: `${currencyToBuy}`, autoConfirm: true };
        let cryptoBody = {
            "source":"ethereum:0xdb5435feebd064bdee1c841158e14d235d0fa6ff",
            "sourceCurrency":"ETH","sourceAmount":"0.00004","dest":"bitcoin:mzEx8yaQiRjf4vHErJWKeTucYevyF4TkWg",
            "destCurrency":"BTC","message":"Sending the some eth to btc",
            "autoConfirm": true
        };

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
                <ThemedButton text={`Buy ${currencyToBuy} `} onPress={() => this.handleBuyTransaction(cryptoBody, accountId)} />
            </React.Fragment>)
    };
    //for sell, we shall send to the account's payment method

    sell() {
        const {accountFromDb} = this.props;
        let accountId = accountFromDb && accountFromDb.response.wyreAccount.id;
        let paymentmethodId = accountFromDb && accountFromDb.response.paymentMethods.id;
        console.log(paymentmethodId, 'in sell component')
        console.log(accountFromDb, '>>>>>>>>>>>>>Sssa')
        const { currencyToSell, sourceAmountToSell, fundsSource } = this.state;
        // You can now sell your BTC, ETH, or DAI and have cash deposited directly into your bank account. 
        // You can now sell your BTC, ETH, or DAI and have cash deposited directly into your bank account. 
        const rates = this.props.rates && this.props.rates.rates;
        console.log(rates);
        // source will be a crpto address, source currency is determined by what the user wants to sell
        let cryptoBody = { source: '', sourceCurrency: "", sourceAmount: sourceAmountToSell, "dest": `paymentmethod${paymentmethodId}:ach`, destCurrency: "USD", autoConfirm: true };

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
                    </select>
                </label>
                <br />
                Amount to sell: <br />
                <input type="number" name="sourceAmountToSell" value={sourceAmountToSell} placeholder='Amount to sell' onChange={e => this.handleChange(e)} />
                <br />
                USD Equivalent: {currencyToSell === 'BTC' ? (BTC_to_USD * sourceAmountToSell) : (ETH_to_USD * sourceAmountToSell)} usd
                <br />
                <ThemedButton text={`Sell ${currencyToSell} `} onPress={() => this.handleSellTransaction(cryptoBody, accountId)} />
            </React.Fragment>
        )
    }
    render() {
        const {action} =  this.state; 
        console.log(action, 'action');
        const {accountFromDb, transaction} = this.props;
        if(accountFromDb === null){
            return <Loader color={'green'} type={'spin'} />
        } 
        // if(accountFromDb.response.wyreAccount.status !== 'OPEN' || accountFromDb.response.paymentMethods.status === 'PENDING'){
        //     return 'You cannot transact yet'
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
            {action === "buy crypto" ? this.buy() : this.sell()}
            {transaction ? JSON.stringify(`Transaction complete, ID: ${transaction.transfer.id}`) : undefined}
            </React.Fragment>
        );
    }

}

const mapStateToProps = (state: any) => {
    return {
        accountFromDb: state.accountReducer.accountFromDb,
        rates: state.accountReducer.rates,
        transaction: state.accountReducer.buyTransaction,
    }
}

export default connect(mapStateToProps)(Trade);