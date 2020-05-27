import React from 'react';
//@ts-ignore
import Script from 'react-load-script'
import toast from 'toastr';
import axios from 'axios';
import {WYRE_BACKEND_ENDPOINT} from '../urls';


/* As a partner developer, you will not have direct access to the customer's personal information. The underlying personal information is exposed only in response to demands made to Wyre lawfully (or, in some cases, in support of security authorization). */
type WyreDebitCardState = {
    dest?: string,
    destCurrency?: string,
    sourceAmount: number,
    showWidget: boolean
}

type WyreDebitCardProps = {
    dest?: string,
    destCurrency?: string,
    sourceAmount: number,
}

type WyreDebitCardStateUpdate = {
    dest?: string,
    destCurrency?: string,
    sourceAmount?: number,
}

export class WyreDebitCard extends React.Component<WyreDebitCardProps, WyreDebitCardState> {
    constructor(props: WyreDebitCardProps) {
        super(props);
        this.state = {
            dest: '',
            destCurrency: '',
            sourceAmount: 0,
            showWidget: false
        }
    }

    static getDerivedStateFromProps(nextProps: WyreDebitCardProps, prevState: WyreDebitCardState) {
        let update: WyreDebitCardStateUpdate = {};
        if (nextProps.dest !== prevState.dest) {
            update.dest = nextProps.dest;
            // return { dest: nextProps.dest }; // <- this is setState equivalent
        }
        if (nextProps.destCurrency !== prevState.destCurrency) {
            update.destCurrency = nextProps.destCurrency;
            // return { destCurrency: nextProps.destCurrency };
        }
        if (nextProps.sourceAmount !== prevState.sourceAmount) {
            update.sourceAmount = nextProps.sourceAmount;
            // return { sourceAmount: nextProps.sourceAmount };
        }
        return Object.keys(update).length ? update : null;
    }


    render() {
        const { showWidget } = this.state;
        const { destCurrency, dest, sourceAmount } = this.state;
        // let secretKey = localStorage.getItem('DEVICE_TOKEN');
        // if (!secretKey) {
        //     let buffer = require('crypto').randomBytes(48);
        //     secretKey = buffer.toString('base64').replace(/\//g, '_').replace(/\+/g, '-');
        // }
        var deviceToken = localStorage.getItem("DEVICE_TOKEN");
        if (!deviceToken) {
            var array = new Uint8Array(25);
            window.crypto.getRandomValues(array);
            deviceToken = Array.prototype.map.call(array, x => ("00" + x.toString(16)).slice(-2)).join('');
            localStorage.setItem("DEVICE_TOKEN", deviceToken);
        }

        console.log(this.props, 'this.props');
        console.log(this.state, 'this.props');
        // @ts-ignore


        const showWidgetButton = () => {
            const {dest, sourceAmount} = this.state;
            //@ts-ignore
            var widget = new Wyre({
                env: "test",
                accountId: "AC_JZRHZANBEFP",
                auth: {
                    type: "secretKey",
                    secretKey: deviceToken,
                },
                operation: {
                    type: "debitcard-hosted-dialog",
                    destCurrency: destCurrency || "ETH",
                    destAmount: sourceAmount || 0,
                    dest: dest || "0x415C07a820B30080d531048b589Fe27910e00639", //meta mask kovan eth
                    paymentMethod: 'debit-card'
                },
            });


            widget.on("exit", function (e: any) {
                console.log("exit", e);
                toast.error(JSON.stringify(e));
            })

            widget.on("error", function (e: any) {
                console.log("error", e);
                toast.error(JSON.stringify(e));
            })

            widget.on("complete", function (e: any) {
                console.log("complete", e);
                toast.success(JSON.stringify(e));
            });

            widget.on('ready', function (e: any) {
                console.log("ready", e);
                // widget.open();
            });

            widget.on('paymentSuccess', async function(paymentObject: any ){
                console.log(paymentObject , 'paymentSuccess');
                const accountId = paymentObject.data.data.accountId;
                const transferId = paymentObject.data.data.transferId;
                try{
                    let response = await axios.get(`${WYRE_BACKEND_ENDPOINT}/debitcards?accountId=${accountId}&transferId=${transferId}`);
                    console.log(response.data, 'payment succes object from wyre widget');
                }
                catch(error){
                    console.log(error);
                }

            })
            return (
                <button onClick={() => widget.open()}>DebitCard</button>
            )
        };

        return (
            <React.Fragment>
                <Script
                    url="https://verify.sendwyre.com/js/verify-module-init-beta.js"
                    onCreate={() => console.log('creating script')}
                    onError={() => console.log('error creating script')}
                    onLoad={() => this.setState({ showWidget: true })}
                />
                {!!showWidget ? showWidgetButton() : 'Loading Wyre Widget'}
            </React.Fragment>
        );
    }
}