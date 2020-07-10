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

export default cosmosDBTrigger;

function sendNotifications (){
    let smsurl = "https://app.notify.lk/api/v1/send";

    let userId = "12105";
    let APIKey = "D9ApoNCnlWTPbO46sJVd";
    let senderId = "NotifyDEMO";

    let data = {"user_id":userId,"api_key":APIKey,"sender_id":senderId,"to":"94713355704","message":"Test"};

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
