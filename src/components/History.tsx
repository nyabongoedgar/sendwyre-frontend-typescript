import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import Loader from './Loader';
import { CheckUserAccount } from '../actions/actionCreators';
export function History(props: any): any {
    React.useEffect(() => {
        (async () => {
            const response = await axios.get('http://localhost:3000/api/v1/users/900');
            console.log(response.data, 'user data');
            props.dispatch(CheckUserAccount(response.data));
        })();
    }, [])
    const { userInfoFromDb } = props;

    if (userInfoFromDb === null) {
        return <Loader />
    }

    if (userInfoFromDb.success === false) {
        return 'No account Found'
    }

    const transactions = userInfoFromDb.user && userInfoFromDb.user.transactions;

    return (
        <React.Fragment>
            {transactions !== undefined ?
                (<table className="table">
                    <thead>
                        <tr>
                            <th scope="col">Status</th>
                            <th scope="col">Source Amount</th>
                            <th scope="col">Destination Amount</th>
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
                </table >) : 'You currently have no transactions'}
        </React.Fragment>
    )
}

const mapStateToProps = (state: any) => ({
    userInfoFromDb: state.reducer.userInfoFromDb
})
export default connect(mapStateToProps)(History)