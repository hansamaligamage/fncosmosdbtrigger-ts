# Cosmos DB trigger in Typescript to get new documents in database, process them and send sms notifications

Cosmos DB trigger in Typescript to get new documents saved and store them in CosmosDB using SQL API

This is a Cosmos DB trigger function written in Typescript in Visual Studio Code as the editor. It waits until a document creates in the database, process it and send notifications to a mobile phone


## Technology stack  
* Typescript version 3.9.6 *(npm i typescript)* https://www.npmjs.com/package/typescript 
* Azure functions for typescript version 1.2.2 *(npm i @azure/functions)* https://www.npmjs.com/package/@azure/functions 
* isomorphic-fetch version 2.2.1 used to send sms notifications using a sms API (https://www.notify.lk/) *(npm i isomorphic-fetch es6-promise)* https://www.npmjs.com/package/isomorphic-fetch

## How to run the solution
 * You have to create a Cosmos DB account with SQL API then go to the Keys section, get the connectionstring to connect to the database
 * Open the solution file in Visual Studio and build the project
 
 ## Code snippets
 ### Cosmos DB trigger to track the documentchanges
 ```
 import { AzureFunction, Context } from "@azure/functions"
require('isomorphic-fetch');

const cosmosDBTrigger: AzureFunction = async function (context: Context, documents: any[]): Promise<void> {
    if (!!documents && documents.length > 0) {
        context.log('Document Id: ', documents[0].id);

        let speed = documents[0].speed;
        let city = documents[0].city;
        let vehicleNumber = documents[0].vehicleNumber;

        if(speed > 80)
        {
            let message = `High speed detected in ${city}, Vehicle No ${vehicleNumber} and Speed ${speed}`;
            context.log(message);
            sendNotifications();
        }
    }
}
```

### Send sms notifications using a sms API
```
function sendNotifications (){
    let smsurl = "https://app.notify.lk/api/v1/send";

    let userId = "12105";
    let APIKey = "D9ApoNCnlWTPbO46sJVd";
    let senderId = "NotifyDEMO";

    let data = {"user_id":userId,"api_key":APIKey,"sender_id":senderId,"to":"94713355704",
       "message":"Test"};

    fetch(smsurl, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "same-origin"
      }).then(function(response) {
          console.log(response.status);
          console.log(response.statusText);
        return response.text()
      }, function(error) {
        error.message
        console.log(error.message);
      })
}
```

### Setup function bindings in functions.json 
```
{
  "bindings": [
    {
      "type": "cosmosDBTrigger",
      "name": "documents",
      "direction": "in",
      "leaseCollectionName": "leases",
      "connectionStringSetting": "DBConnectionstring",
      "databaseName": "trafficdata",
      "collectionName": "vehicles",
      "createLeaseCollectionIfNotExists": "true"
    }
  ],
  "scriptFile": "../dist/SendNotification/index.js"
}
```
