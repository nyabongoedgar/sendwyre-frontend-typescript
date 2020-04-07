import React from 'react';
import { connect } from "react-redux";
//@ts-ignore
import Loader from 'react-loader';
import axios from 'axios';
import { successAccountCreation, failedCreation, startAction } from "../actions/accountActions"
//@ts-ignore
// import { ThemedButton } from "unifyre-web-wallet-components";
// interface props {
//     loading: boolean;
//     account: object;
//     saveData: (account: any) => void
// }
export class CreateAccount extends React.Component<any, any>{
    constructor(props: any) {
        super(props);
    }
    render() {

        return (
            <React.Fragment>
                <Loader loaded={!this.props.loading} top="35%" left="35%">
                <button onClick={async () => {
                    console.log(this.props)
                    this.props.dispatch(startAction());
                    const response = await axios.post('http://localhost:3000/api/v1/accounts')
                        .then(response => {
                            console.log(this.props)
                            this.props.dispatch(successAccountCreation(response.data));
                        })
                        .catch(error => {
                            this.props.dispatch(failedCreation(JSON.stringify(error)));
                        });
                    return response;
                }}> Create Account</button> </Loader>
                <div id="accountData" style={{color: 'red'}}>
                    {this.props.account ? 'Account created' : ''}
                    <br />
                    {this.props.loading === true ? 'creating account' : undefined}
                    <br />
                    {/* 
            // @ts-ignore */}
            Account Status: {this.props.account ? JSON.stringify(this.props.account.response.status) : ''}
            <br />
            {/* 
            // @ts-ignore */}
            Account id: {this.props.account ? JSON.stringify(this.props.account.response.id) : ''}

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