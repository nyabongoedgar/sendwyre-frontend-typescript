import React from 'react';
import { connect } from "react-redux";
import axios from 'axios';
import toast from 'toastr';
import { successAccountCreation, failedAccountCreation, startAction, SetProcess } from "../actions/actionCreators"
//@ts-ignore
import { ThemedButton } from "unifyre-web-wallet-components";

export class CreateAccount extends React.Component<any, any>{

    
    handleAccountCreation = async () => {
        try {
            this.props.dispatch(startAction({createWyreAccountLoading: true}));
            this.props.dispatch(SetProcess('Creating an account for you'));
            const response = await axios.post('http://localhost:3000/api/v1/accounts')
            this.props.dispatch(successAccountCreation(response.data));
            toast.success('Account Created');
            this.props.dispatch(SetProcess(''));
            return response.data;
        } catch (error) {
            this.props.dispatch(failedAccountCreation(JSON.stringify(error.response.data)));
            toast.error(error.response.data.message);
        }
    }
    render() {
        return (
            <React.Fragment>
                <ThemedButton onPress={this.handleAccountCreation} text={'Create Account'} />
            </React.Fragment>
        );
    }
}

export default connect()(CreateAccount);