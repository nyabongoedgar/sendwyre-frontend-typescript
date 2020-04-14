import React from 'react';
import axios from "axios";
import { connect } from "react-redux";
//@ts-ignore
import { InputGroupAddon, ThemedButton } from 'unifyre-web-wallet-components';
import { SaveRates } from '../actions/accountActions';

export class Transfer extends React.Component<any, any>{
    constructor(props: any) {
        super(props);
        this.state = {
            currency: null,
            sourceAmount: null,
        }
    }
    componentDidMount() {
        //get rates, we need to have account data such as tehe unifyre, crypto value
        (async () => {
            const response = await axios.get("http://localhost:3000/api/v1/rates");
            SaveRates(response.data);
        })();
    }

    handleChange(event: any) {
        this.setState({ [event.target.name]: event.target.value });
    }

    async handleTransaction() {
        try {
            const { sourceAmount, currency } = this.state;
            let body = { source: "account:AC_YNWFWXDW3AG", sourceCurrency: "USD", sourceAmount: sourceAmount, "dest": `${currency}:`, destCurrency: "USD", autoConfirm: true };
            const response = await axios.post('http://localhost:3000/api/v1/transfers', {
                accountId: '',
                body
            });
            return response.data;
            // dest : we should append an address on dest, this will come from the global state object.
        } catch (error) {
            throw new Error(error);
        }
    }

    render() {
        const { currency, sourceAmount } = this.state;
        return (
            //The amount you send here fgoes directly to your unifyre bitcoin or eth address
            <React.Fragment>
                <select value='' name='currency' onChange={(e) => this.handleChange(e)}>
                    <option value="BTC">BTC</option>
                    <option value="ETH">ETH</option>
                </select>
                <br />
                <input type="number" name="sourceAmount" value={sourceAmount} />
                Maximum amount to send: <br />

                {/* {"source":"account:AC_YNWFWXDW3AG","sourceCurrency":"USD","sourceAmount":"200","dest":"paymentmethod:PA_L64RP4JB73L","destCurrency":"USD","message":"Sending the user payment method"} */}
                <ThemedButton onPress={() => this.handleTransaction()} />
            </React.Fragment>)
    }

}

const mapStateToProps = (state: any) => {
    return {
        accountFromDb: state.accountReducer.accountFromDb,
        rates: state.accountReducer.rates,
    }
}

export default connect(mapStateToProps)(Transfer);