import React from 'react';
import axios from "axios";
import { connect, ConnectedProps } from "react-redux";
import {RootState} from "../reducers";
import Loader from './Loader';
//@ts-ignore
import { InputGroupAddon, ThemedButton, Gap } from 'unifyre-web-wallet-components';
import Buy from './Buy';
import Sell from './Sell';
import { SaveRates, SaveLimits, CheckUserAccount } from '../actions/actionCreators';
import {WYRE_BACKEND_ENDPOINT} from '../urls';

const mapState = (state: RootState) => {
    return {
        userInfoFromDb: state.reducer.userInfoFromDb
    }
}

const connector = connect(mapState);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {action: 'buy' | 'sell'};
export class Trade extends React.Component<Props, {}>{
    constructor(props: any) {
        super(props);
        // this.state = {showModal: false}
    }
    componentDidMount() {
        /**
         * get exchange rates and limits
         */
        (async () => {
            const rates = await axios.get(`${WYRE_BACKEND_ENDPOINT}/rates`);
            const limits = await axios.get(`${WYRE_BACKEND_ENDPOINT}/limits`);
            this.props.dispatch(SaveRates(rates.data))
            this.props.dispatch(SaveLimits(limits.data))
        })();
    }

    fetchUser = async (userId: any) => {
        const response = await axios.get(`${WYRE_BACKEND_ENDPOINT}/users/${userId}`);
        console.log(this.props, 'fetch user')
        this.props.dispatch(CheckUserAccount(response.data));
    }

    // handleChange(event: any) {
    //     this.setState({ [event.target.name]: event.target.value });
    // }



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
                        <Buy fetchUser={this.fetchUser}  /> :
                        <Sell fetchUser={this.fetchUser} />
                }
            </React.Fragment>
        );
    }

}

export default connector(Trade);