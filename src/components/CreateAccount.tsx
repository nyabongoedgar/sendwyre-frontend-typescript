import React from 'react';
import { connect } from "react-redux";
//@ts-ignore
import axios from 'axios';
import { successAccountCreation, failedCreation, startAction, SetProcess } from "../actions/accountActions"
//@ts-ignore
import { ThemedButton } from "unifyre-web-wallet-components";

export class CreateAccount extends React.Component<any, any>{
    constructor(props: any) {
        super(props);
    }

    handleAccountCreation = async () => {
        try {
            this.props.dispatch(startAction());
            this.props.dispatch(SetProcess('Creating an account for you'));
            const response = await axios.post('http://localhost:3000/api/v1/accounts')
            this.props.dispatch(successAccountCreation(response.data));
            this.props.dispatch(SetProcess(''));
            return response.data;
        } catch (error) {
            this.props.dispatch(failedCreation(JSON.stringify(error)));
            alert(JSON.stringify(error["message"]))
        }
    }
    render() {
        const {account, loading} = this.props;
        return (
            <React.Fragment>
               
                    <ThemedButton onPress={this.handleAccountCreation} text={'Create Account'} />
                <div id="accountData" style={{ color: 'red' }}>
                    {account ? 'Account created' : ''}
                    <br />
                    {loading === true ? 'creating account' : undefined}
                    <br />
                    
                    {/* 
            // @ts-ignore */}
            Account Status: {account ? JSON.stringify(account.response.status) : ''}
                    <br />
                    {/* 
            // @ts-ignore */}
            Account id: {account ? JSON.stringify(account.response.id) : ''}

                </div>
            </React.Fragment>
        );
    }
}
const mapStateToProps = (state: any) => {
    return {
        account: state.accountReducer.account,
        loading: state.accountReducer.loading,
        error: state.accountReducer.error,
        accountFromDb: state.accountReducer.accountFromDb
    }
}

export default connect(mapStateToProps)(CreateAccount);