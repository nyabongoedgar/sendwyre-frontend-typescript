import React from 'react';
import { connect, ConnectedProps  } from "react-redux";
//@ts-ignore
import { InputGroupAddon, ThemedButton, Gap } from 'unifyre-web-wallet-components';
import {RootState} from '../reducers';
import axios from "axios";
import toast from 'toastr';
import Loader from './Loader';
import { SetBuyTransaction, failedBuyTransaction, startAction } from '../actions/actionCreators';
import { WyreDebitCard } from './WyreDebitCard';
import {WYRE_BACKEND_ENDPOINT} from '../urls';


type BuyState = {
    [x: number]: any,
    sourceAmount: number
};

type BuyProps = {
    fetchUser: (userId: string) => void
};

const mapState = (state: RootState) => {
    return {
        userInfoFromDb: state.reducer.userInfoFromDb,
        rates: state.reducer.rates,
        buyTransaction: state.reducer.buyTransaction,
        buyTransactionLoading: state.reducer.buyTransactionLoading,
        buyTransactionError: state.reducer.buyTransactionError,
        unifyreUserProfile: state.reducer.unifyreUserProfile,
        transferQuote: state.reducer.transferQuote
    }
}

const connector = connect(mapState);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & BuyProps;

export class Buy extends React.Component<Props, BuyState>{
    constructor(props: any) {
        super(props);
        this.state = {
            sourceAmount: 0
        }
    }

    handleChange(event: any) {
        this.setState({ [event.target.name]: event.target.value });
    }

    async handleTransfer(body: any, accountId: string) {
        try {
            this.props.dispatch(startAction({ buyTransactionLoading: true }))
            const response = await axios.post(`${WYRE_BACKEND_ENDPOINT}/transfers`, {
                accountId,
                transaction: body
            });
            this.props.dispatch(SetBuyTransaction(response.data));
            toast.success('You have bought crypto success, wait for a few minutes', 'Crypto Purchase')
            //we need to fetch user data here again
            this.props.fetchUser(this.props.unifyreUserProfile.userId);
            // this.showModal();
            return response.data;
        } catch (error) {
            this.props.dispatch(failedBuyTransaction(error.response.data));
            toast.error(this.props.buyTransactionError.message, 'Crypto Purchase failed');
        }
    }

    // async quoteTransfer(body: any, accountId: string) {
    //     try {
    //         this.props.dispatch(startAction({ buyTransactionLoading: true }))
    //         const response = await axios.post('http://localhost:3000/api/v1/quoteTransfer', {
    //             accountId,
    //             transaction: body
    //         });
    //         this.props.dispatch(saveTransferQuote(response.data));
    //         // toast.success('You have bought crypto success, wait for a few minute', 'Crypto Purchase')
    //         //we need to fetch user data here again
    //         this.showModal();
    //         return response.data;
    //     } catch (error) {
    //         this.props.dispatch(failedBuyTransaction(error.response.data));
    //         toast.error(this.props.buyTransactionError.message, 'Crypto Purchase failed');
    //     }
    // }

    // confirmBuy = async () => {

    //     try {
    //         let response = await axios.post('http://localhost:3000/api/v1/confirmTransfer', {
    //             accountId: this.props.userInfoFromDb.user.wyreAccount.id,
    //             transferId: this.props.transferQuote.quotedTransfer.id
    //         });
    //         console.log(response.data, 'this comes from the other confirm buy on the frontend')
    //         this.props.dispatch(SetBuyTransaction(response.data));
    //         await this.props.fetchUser(this.props.unifyreUserProfile.userId);
    //         toast.success('You have bought crypto success, wait for a few minute', 'Crypto Purchase')
    //     } catch (error) {
    //         console.log(error, 'error in confirmation')
    //     }
    // }


    renderBuyComponent() {
        // this is from the bank (paymentMethod, or debit card) to your unifyre address

        const { addresses } = this.props.unifyreUserProfile.accountGroups[0];
        const { symbol, currency: unifyreCurrency, balance, address: unifyreAddress } = addresses[0];
        const { sourceAmount } = this.state;
        const { userInfoFromDb } = this.props;
        const paymentMethod = userInfoFromDb && userInfoFromDb.user.paymentMethods[0];
        // let paymentmethodName = userInfoFromDb && userInfoFromDb.user.paymentMethods[0].name;
        let accountId = this.props.userInfoFromDb && this.props.userInfoFromDb.user.wyreAccount.id;
        console.log(accountId);
        const rates = this.props.rates && this.props.rates.rates;
        const whatYouGetInETH = rates && rates.USDETH * sourceAmount

        // let transaction = {
        //     "source":"ethereum:0xdb5435feebd064bdee1c841158e14d235d0fa6ff",
        //     "sourceCurrency":"ETH","sourceAmount":"0.00004","dest":"bitcoin:mzEx8yaQiRjf4vHErJWKeTucYevyF4TkWg",
        //     "destCurrency":"BTC","message":"Sending the some eth to btc",
        //     "autoConfirm": true
        // };
        const fee = whatYouGetInETH * 0.0075;


        let transaction = { source: "ethereum: 0xdB5435FeeBd064bdEe1c841158e14d235d0FA6FF", sourceCurrency: "ETH", sourceAmount: 0.00002, dest: "ethereum:0x415C07a820B30080d531048b589Fe27910e00639", autoConfirm: true, amountIncludeFees: true };
        return (
            <React.Fragment>
                <h1>Buy {symbol}</h1>
                <br />
                I want to spend:  <br />
                <input type="number" name="sourceAmount" value={sourceAmount} onChange={(e: any) => this.handleChange(e)} placeholder={'Amount to buy'} required />
                <br />
                Indicative price: 1 USD =  {rates ? rates.USDETH + 'ETH' : 'loading'}
                <br />
                Approximate fee : {`${fee} ${symbol}`}
                <br />
                {/* You will receive: {symbol.toUpperCase() === 'BTC' ? `${whatYouGetInBTC} BTC` : `${whatYouGetInETH} ETH`} */}
                You will receive approximately: {`${whatYouGetInETH - fee} ETH`}
                <br />
                <div style={{ display: "flex", justifyContent: "space-evenly", flexDirection: "row", width: "410px" }}>
                    Buy with : <WyreDebitCard /*dest={`${symbol}:unifyreAddress`} */ sourceAmount={sourceAmount} />

                    <ThemedButton text={`Buy ${symbol} with your bank account`} onPress={() => this.handleTransfer(transaction, "AC_JZRHZANBEFP" /*accountId*/)} disabled={this.props.buyTransactionLoading} />
                </div>
            </React.Fragment>)
    };

    render() {
        const { userInfoFromDb } = this.props;
        if (userInfoFromDb === null) {
            return <Loader color={'green'} type={'spin'} />
        }
        // if(userInfoFromDb.user.wyreAccount.status !== 'OPEN' || userInfoFromDb.user.paymentMethods[0].status === 'PENDING'){
        //     return 'You cannot transact yet, your account and payment method will be approved soon';
        // } //this will help us get users, who paymentmethod is not active

        return (
            <React.Fragment>
                <Gap />
                {this.renderBuyComponent()}
            </React.Fragment>
        );
    }
}

export default connector(Buy);