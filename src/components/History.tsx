import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import Loader from './Loader';
import {RootState} from '../reducers';

const mapState = (state: RootState) => {
    return {
        userInfoFromDb: state.reducer.userInfoFromDb,
    }
};

const connector = connect(mapState);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux;

export function History(props: Props): any {

    const { userInfoFromDb } = props;
    const transactions = userInfoFromDb.user && userInfoFromDb.user.transactions;
    console.log(transactions, 'user transactions');

    return (
        <React.Fragment>
            {!!transactions.length ?
                (
                <React.Fragment>
                <h1>Transaction History</h1>
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">Status</th>
                            <th scope="col">Source Amount</th>
                            <th scope="col">Destination Amount</th>
                            <th scope="col">Total Fees</th>
                            <th scope="col">Transaction Id</th>
                            <th scope="col">CreatedAt</th>
                        </tr>
                    </thead>

                    <tbody>
                        {transactions && transactions.map((element: any, key: any) => {
                            return (
                                <tr key={key}>
                                    <td>{element.status}</td>
                                    <td>{element.sourceAmount}</td>
                                    <td>{element.destAmount}</td>
                                    <td>{element.totalFess}</td>
                                    <td>
                                        <a href={`https://www.testwyre.com/track/${element.id}`} target={"_blank"}>
                                            {element.id}
                                        </a>
                                    </td>
                                    <td>{new Date(element.createdAt).toLocaleString()}</td>
                                </tr>
                            );
                        }).reverse()}

                    </tbody>
                </table > </React.Fragment>) : 'You currently have no transactions'}
        </React.Fragment>
    )
}

export default connector(History)