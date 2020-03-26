import * as React from 'react';

export function PlaidUi(){
  const [result, setResult] = React.useState();
    // @ts-ignore
    let handler = new WyrePmWidget({
        env: "test",
        onLoad: function(){
          // In this example we open the modal immediately on load. More typically you might have the handler.open() invocation attached to a button.
          handler.open();
        },
        onSuccess: function(result: any){
          // Here you would forward the publicToken back to your server in order to  be shipped to the Wyre API
          // console.log(result.public_token);
          setResult(result)
          console.log(result, 'result')
        },
        onExit: function(err: any){
          if (err != null) {
            // The user encountered an error prior to exiting the module
          }
          console.log("Thingo exited:", err);
        }
      });

      return(
        <React.Fragment>
          <button onClick={() => handler}>Open Plaid UI</button>
          {!result ? result  : result}
        </React.Fragment>
      )
      
  }


  const sampleResult = {
    "accounts": [
      {
        "account_id": "PzBxp5nnqZcqAd4JggL3sd33EABEwZF7lzk1z",
        "balances": {
          "available": 100,
          "currency": "USD",
          "current": 110,
          "localized": {
            "available": "$100.00",
            "current": "$110.00"
          }
        },
        "mask": "0000",
        "name": "Plaid Checking",
        "subtype": "checking",
        "type": "depository"
      },
      {
        "account_id": "jE89VlQQAmCK6xE5qqR7hEKKolMob9F1gJMEP",
        "balances": {
          "available": 200,
          "currency": "USD",
          "current": 210,
          "localized": {
            "available": "$200.00",
            "current": "$210.00"
          }
        },
        "mask": "1111",
        "name": "Plaid Saving",
        "subtype": "savings",
        "type": "depository"
      },
      {
        "account_id": "7q9xAEzzB5SpeP3Zqq6ATrQQ6gw6pWigkXlZe",
        "balances": {
          "available": null,
          "currency": "USD",
          "current": 1000,
          "localized": {
            "available": null,
            "current": "$1,000.00"
          }
        },
        "mask": "2222",
        "name": "Plaid CD",
        "subtype": "cd",
        "type": "depository"
      },
      {
        "account_id": "eEmGV5NNoxCwXMeyWW7PU3ww9yG9amHLZWdgz",
        "balances": {
          "available": null,
          "currency": "USD",
          "current": 410,
          "localized": {
            "available": null,
            "current": "$410.00"
          }
        },
        "mask": "3333",
        "name": "Plaid Credit Card",
        "subtype": "credit card",
        "type": "credit"
      },
      {
        "account_id": "QB3do5bbKGCwkEKdWWPxUoeeQqaQnVfpQKM1W",
        "balances": {
          "available": 43200,
          "currency": "USD",
          "current": 43200,
          "localized": {
            "available": "$43,200.00",
            "current": "$43,200.00"
          }
        },
        "mask": "4444",
        "name": "Plaid Money Market",
        "subtype": "money market",
        "type": "depository"
      },
      {
        "account_id": "Z7mZV5llNytjga81bbxQTLjjy4xyAaCgy7R3V",
        "balances": {
          "available": null,
          "currency": "USD",
          "current": 320.76,
          "localized": {
            "available": null,
            "current": "$320.76"
          }
        },
        "mask": "5555",
        "name": "Plaid IRA",
        "subtype": "ira",
        "type": "brokerage"
      },
      {
        "account_id": "MqKzM5WWANSeK4E6LLgrSxWWePJeRzu9gQlKP",
        "balances": {
          "available": null,
          "currency": "USD",
          "current": 23631.9805,
          "localized": {
            "available": null,
            "current": "$23,631.98"
          }
        },
        "mask": "6666",
        "name": "Plaid 401k",
        "subtype": "401k",
        "type": "brokerage"
      },
      {
        "account_id": "1Z9qp1XXGMFbVMGdDDjoHjoo9bm9Gxt5dMKzo",
        "balances": {
          "available": null,
          "currency": "USD",
          "current": 65262,
          "localized": {
            "available": null,
            "current": "$65,262.00"
          }
        },
        "mask": "7777",
        "name": "Plaid Student Loan",
        "subtype": "student",
        "type": "loan"
      }
    ],
    "public_token": "public-sandbox-9abeea9e-d55a-451b-98ea-efda16d6f878",
    "request_id": "go7mYG2I7JQjdaC"
  }