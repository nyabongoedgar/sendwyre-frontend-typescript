import React from 'react';
import { connect } from 'react-redux';
import axios from "axios";
import { CheckUserAccount } from './actions/actionCreators';
import Router from './components/Router';
import './customStyles/toast.scss'
export class App extends React.Component<any, any> {

  componentDidMount() {
    (async () => {
      const response = await axios.get('http://localhost:3000/api/v1/users/1000');
      console.log(response.data, 'user data');
      this.props.dispatch(CheckUserAccount(response.data));
    })();
  }
  render() {
      return (
        <div className='container'>
          <Router />
        </div>
      );
  }
}

export default connect()(App);