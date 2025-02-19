// import fetch from 'node-fetch';
// import { createHash, createHmac } from 'crypto';

// // Function to create a base64 encoded SHA256 hash
// function createSHA256Hash(body) {
//     return createHash('sha256').update(body).digest('base64');
// }

// // Function to sign the message
// function signMessage(apiSecret, message) {
//     return createHmac('sha256', apiSecret)
//         .update(message)
//         .digest('base64');
// }

// // Function to make the authenticated request
// async function makeAuthenticatedRequest(apiKey, apiSecret, method, path, host, body = null) {
//     const timestamp = new Date().toISOString();
//     let message = `${timestamp}${path}${method}`;

//     if (method === 'POST' || method === 'PUT') {
//         const bodyHash = createSHA256Hash(JSON.stringify(body));
//         message += bodyHash;
//     }

//     const signature = signMessage(apiSecret, message);
//     const authHeader = `YcHmacV1 ${apiKey}:${signature}`;

//     const url = `https://${host}${path}`;
//     const headers = {
//         'X-YC-Timestamp': timestamp,
//         'Authorization': authHeader,
//         'Content-Type': 'application/json'
//     };

//     const options = {
//         method: method,
//         headers: headers,
//         body: JSON.stringify(body)
//     };

//     try {
//         const response = await fetch(url, options);
//         return await response.json();
//     } catch (error) {
//         console.error('Error making request:', error);
//         throw error;
//     }
// }

// // Example usage
// const apiKey = 'your-api-key';
// const apiSecret = 'your-secret-key';
// const method = 'POST';
// const path = '/business/payments/accept';
// const host = 'api.yourhost.com';
// const body = { amount: 100, currency: 'USD' };

// makeAuthenticatedRequest(apiKey, apiSecret, method, path, host, body)
//     .then(response => console.log('Response:', response))
//     .catch(error => console.error('Error:', error));


import dotenv from 'dotenv';
import CryptoJS from 'crypto-js';
import fetch from 'node-fetch';
import { destination } from 'pino';
// import fs from 'fs/promises';
import channels from "../../blockchainData/africa/channels.json"


dotenv.config();

const apiKey = "f09e40ac2076da05587bb09932255370";
const secretKey = "19b808d613437931c079530c85368661cbd6c87861bce938d1c2739598a3c02d"
;
const requestPath = "/business/channels";
const requestMethod = "GET";
const baseURL = 'https://sandbox.api.yellowcard.io';

const httpAuth = (path, method, body) => {
  const date = new Date().toISOString();
  const hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, secretKey);

  hmac.update(date, 'utf8');
  hmac.update(path, 'utf8');
  hmac.update(method, 'utf8');

  if (body) {
    const bodyHmac = CryptoJS.SHA256(JSON.stringify(body)).toString(CryptoJS.enc.Base64);
    hmac.update(bodyHmac);
  }

  const hash = hmac.finalize(); 
  const signature = CryptoJS.enc.Base64.stringify(hash);

  return {
    "X-YC-Timestamp": date,
    "Authorization": `YcHmacV1 ${apiKey}:${signature}`
  }
}

// async function getChannelsRequest(){
//     try{
//         const headers = httpAuth(requestPath, requestMethod);
//         const response = await 

//     }
//     catch(error){

//     }
// }

export async function testRequest() {
  const headers = httpAuth(requestPath, requestMethod);

  const response = await fetch(`${baseURL}${requestPath}`, {
    method: requestMethod,
    headers: {
      ...headers
    }
  });
  const data = await response.json();
  //console.log(data);

  return data;
}

export async function getChannelsAfrica(type) {
  const requestPath = "/business/channels"

  const headers = httpAuth(requestPath, requestMethod);

  const response = await fetch(`${baseURL}${requestPath}`, {
    method: requestMethod,
    headers: {
      ...headers
    }
  });
  const data = await response.json();
  const inactiveChannelIds = data.channels
  .filter(channel => channel.status === "inactive")
  .map(channel => channel.id);

const channelData = [...channels];

// First filter: Remove inactive channels
let filteredChannels = channelData.filter(channel => !inactiveChannelIds.includes(channel.id));

filteredChannels = filteredChannels.filter(channel => { 
  //console.log("Checking Channel:", channel); // Debugging log

  // Convert to lowercase and handle undefined values safely
  const rampType = channel.rampType?.toLowerCase() || "";
  const channelType = channel.channelType?.toLowerCase() || "";

 // console.log(`rampType: ${rampType}, channelType: ${channelType}`); // Debugging log

  // Only keep channels that do NOT match "withdraw" or "bank"
  return type === "offramp" 
  ? rampType === "withdraw" && channelType === "bank"
  : rampType === "deposit" && channelType === "bank";

});
const newChannelData = [...filteredChannels];
let currencyFilter =[
  {
    buy: 3715.04,
    sell: 3641.48,
    locale: 'UG',
    rateId: 'ugandan-shilling',
    code: 'UGX',
    updatedAt: '2025-02-11T05:46:41.016Z'
  },
  {
    buy: 636.62,
    sell: 636.62,
    locale: 'CI',
    rateId: 'west-african-franc',
    code: 'XOF',
    updatedAt: '2025-02-11T05:46:57.179Z'
  },
  {
    buy: 27.98,
    sell: 27.98,
    locale: 'ZM',
    rateId: 'kwacha',
    code: 'ZMW',
    updatedAt: '2025-02-11T05:47:11.840Z'
  },
  {
    buy: 2864.63,
    sell: 2864.63,
    locale: 'CD',
    rateId: 'congolese-franc',
    code: 'CDF',
    updatedAt: '2025-02-11T05:47:27.197Z'
  },
  {
    buy: 1420,
    sell: 1364,
    locale: 'RW',
    rateId: 'rwandan-franc',
    code: 'RWF',
    updatedAt: '2025-02-11T05:47:29.276Z'
  },
  {
    buy: 1615,
    sell: 1580,
    locale: 'NG',
    rateId: 'naira',
    code: 'NGN',
    updatedAt: '2025-02-11T05:47:33.596Z'
  },
  {
    buy: 14.13,
    sell: 13.73,
    locale: 'Bw',
    rateId: 'pula',
    code: 'BWP',
    updatedAt: '2025-02-11T05:47:54.081Z'
  },
  {
    buy: 131.48,
    sell: 127.89,
    locale: 'KE',
    rateId: 'kenyan-shilling',
    code: 'KES',
    updatedAt: '2025-02-11T05:48:10.576Z'
  },
  {
    buy: 1737.13,
    sell: 1737.13,
    locale: 'MW',
    rateId: 'malawian-kwacha',
    code: 'MWK',
    updatedAt: '2025-02-11T05:48:34.939Z'
  },
  {
    buy: 18.46,
    sell: 18.46,
    locale: 'LS',
    rateId: 'lesotho-loti',
    code: 'LSL',
    updatedAt: '2025-02-11T05:48:36.415Z'
  },
  {
    buy: 18.99,
    sell: 18.73,
    locale: 'ZA',
    rateId: 'south-african-rand',
    code: 'ZAR',
    updatedAt: '2025-02-11T05:48:39.479Z'
  },
  {
    buy: 636.62,
    sell: 636.62,
    locale: 'CM',
    rateId: 'franc',
    code: 'XAF',
    updatedAt: '2025-02-11T05:49:02.117Z'
  },
  {
    buy: 2559.64,
    sell: 2559.64,
    locale: 'TZ',
    rateId: 'tanzanian-shilling',
    code: 'TZS',
    updatedAt: '2025-02-11T05:49:17.996Z'
  },
  {
    buy: 16.2,
    sell: 15.7,
    locale: 'GH',
    rateId: 'cedi',
    code: 'GHS',
    updatedAt: '2025-02-11T05:49:36.679Z'
  }
]
let finalData = newChannelData.filter(channel => 
  currencyFilter.some(currency => currency.code === channel.currency)
);
// 🔹 Final Debugging Output
//console.log("Final Filtered Channels:", newChannelData);
  return finalData;
}

export async function getNetworks() {
    const requestPath = "/business/networks"

    const headers = httpAuth(requestPath, requestMethod);
  
    const response = await fetch(`${baseURL}${requestPath}`, {
      method: requestMethod,
      headers: {
        ...headers
      }
    });
    const data = await response.json();
    //console.log(data);
    return data;
  }

export async function getRatesAfrica(type,currency){
    try{
      //console.log(currency)
        const requestPath = `/business/rates`

        const headers = httpAuth(requestPath, requestMethod);
      
        const response = await fetch(`${baseURL}${requestPath}`, {
          method: requestMethod,
          headers: {
            ...headers
          }
        });
        const data = await response.json();
        
        let filteredData
        if(type=='fiat')
        filteredData = data?.rates?.filter(item => item?.locale!=='crypto')
        else
        filteredData = data?.rates?.filter(item => item?.locale=='crypto')

        let currencyFilter = filteredData?.filter(item => item?.code?.toString() === currency?.toString());      
        return currencyFilter;

    }catch(error){
      console.log("rates ",error)
      throw error
    }
}  

export async function getAccount(){
    try{
        const requestPath = "/business/account"

        const headers = httpAuth(requestPath, requestMethod);
      
        const response = await fetch(`${baseURL}${requestPath}`, {
          method: requestMethod,
          headers: {
            ...headers
          }
        });
        const data = await response.json();
        //console.log("thisis data",data);
        return data;

    }catch(error){

    }
}  

export async function getBankDetails(data){
    try{
        const requestPath = "/business/details/account"

        const headers = httpAuth(requestPath,"POST",{
            accountNumber:data.accountNumber,
            networkId:data.networkId
        })

        console.log("data----------->",data,headers)
        const response = await fetch(`${baseURL}${requestPath}`,{
            method:"POST",
            header:{
                ...headers
            },
            body: JSON.stringify(data) // Convert the JavaScript object to a JSON string

        })
        const datas = await response.json()
        return datas

    }catch(error){
      console.log(error.message)

    }
}


import crypto from "crypto-js"

async function getBankDetail(payload) {
    try {
        // Current timestamp
        const url = 'https://sandbox.api.yellowcard.io/business/details/bank'; // Adjust the URL as needed

        const date = new Date().toISOString();

        // Create the HMAC object
        const hmac = crypto.algo.HMAC.create(crypto.algo.SHA256, secretKey);

        // Data to be signed
        hmac.update(date);
        hmac.update('/business/details/bank'); // Adjust path as needed
        hmac.update('POST'); // HTTP method

        // Include payload in HMAC if not empty
        if (payload) {
            const payloadString = JSON.stringify(payload);
            const payloadHash = crypto.SHA256(payloadString).toString(crypto.enc.Base64);
            hmac.update(payloadHash);
        }

        // Finalize the HMAC
        const signature = hmac.finalize().toString(crypto.enc.Base64);

        // Set up headers
        const headers = {
            'Content-Type': 'application/json',
            'X-YC-Timestamp': date,
            'Authorization': `YcHmacV1 ${apiKey}:${signature}`
        };

        // Set up the fetch request
        const options = {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(payload)
        };

        // Make the fetch request
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error('Error:', error.message);
    }
}

// Example usage:
const examplePayload = {
  accountNumber: "0760349371",
  networkId: "5f1af11b-305f-4420-8fce-65ed2725a409"
};

export async function createPayment(data){
    try{
        const requestPath = "/business/payments"

        const headers = httpAuth(requestPath,"POST",data)
        const response = await fetch(`${baseURL}${requestPath}`,{
            method:"POST",
            header:{
                ...headers
            }
        })
        const data = await response.json()
        return data

    }catch(error){

    }
}

import { v4 } from 'uuid';

export async function executePayment(){
    try{
      console.log("coming to this pointttttt------")

let channelDatas= await testRequest()
let networkDatas = await getNetworks()
let ratesDatas= await  getRates()

let {channels, networks, rates} = {...networkDatas, ...channelDatas, ...ratesDatas}
let channelData = channels
let networkData = networks
let ratesData = rates

console.log("channels",ratesData)



let activeChannels = channelData.filter(c => c.status === 'active' && c.rampType === 'withdraw')

let supportedCountries = [...new Set(activeChannels.map(c => c.country))]

console.log("coming to this pointttttt------ 2")


let channel = activeChannels[0]

let supportedNetworks = networkData.filter(n => n.status === 'active' && n.channelIds.includes(channel.id));

console.log("coming to this pointttttt------ 3")

let network = supportedNetworks[0]

console.log("coming to this pointttttt------ 4")

const currency = ratesData.filter(r => r.code === 'NGN')

console.log("coming to this pointttttt------ 5")


const amountUSD = 50
const localAmount = amountUSD * currency[0].buy
const reason = 'entertainment'
const sender = {
  name: "Sample Name",
  country: "US",
  phone: "+12222222222",
  address: "Sample Address",
  dob: "mm/dd/yyyy",
  email: "email@domain.com",
  idNumber: "0123456789",
  idType: "license"
}

let destination = {
  accountNumber: "0760349371",
  accountType: network.accountNumberType,
  country: network.country,
  networkId: network.id,
  accountBank: network.code
}



const destinationConf = await getBankDetail({accountNumber:destination.accountNumber,networkId:destination.networkId})

console.log("here is the destinationConf",destinationConf)



destination.accountName = destinationConf.accountName



// let request = {
//   sequenceId: v4(),
//   channelId: channel.id,
//   currency: channel.currency,
//   country: channel.country,
//   amount: amountUSD, //Amount in USD to transact or
//   // localAmount, The amount in local currency to transact
//   reason,
//   destination,
//   sender,
//   forceAccept: true
// }


console.log("--------------------------------------ksjdfklsjdflkslk))))))))))))))))))))))",await makeSecurePaymentRequest({
  "sender": {
     "businessName": "Name of bank",
      "businessId": "Héloïse D'arban"
  },
  "destination": {
      "accountBank": "Name of bank",
      "accountName": "Héloïse D'arban",
      "accountNumber": "1111111111",
      "accountType": "bank",
      "networkId": "6df48502-1ebe-473f-be17-e2cae4dd67ee"
  },
  "channelId": "fe8f4989-3bf6-41ca-9621-ffe2bc127569",
  "sequenceId": v4(),
  "amount": 50,
  "currency": "NGN",
  "country": "Nigeria",
  "reason": "other",
  "customerType": "institution",
  "forceAccept": false
}))



// const response = await createPayment(request)

console.log(response)
    }catch(error){
      console.log("here is the error",error.message)
        
    }
}



// Function to make a secure payment request
export async function makeSecurePaymentRequest(payload) {
  try {
    const url = 'https://sandbox.api.yellowcard.io/business/payments';

    const method = 'POST'
      // Current timestamp
      const date = new Date().toISOString();

      // Create the HMAC object
      const hmac = crypto.algo.HMAC.create(crypto.algo.SHA256, secretKey);

      // Update HMAC with necessary data
      hmac.update(date);
      hmac.update('/business/payments'); // Path of the URL
      hmac.update(method);

      // Hash and include the body if it is not empty
      if (payload) {
          const bodyString = JSON.stringify(payload);
          const bodyHash = crypto.SHA256(bodyString).toString(crypto.enc.Base64);
          hmac.update(bodyHash);
      }

      // Finalize the HMAC and encode in Base64
      const signature = hmac.finalize().toString(crypto.enc.Base64);

      // Set up headers
      const headers = {
          'Content-Type': 'application/json',
          'X-YC-Timestamp': date,
          'Authorization': `YcHmacV1 ${apiKey}:${signature}`
      };

      // Set up the fetch request
      const options = {
          method: method,
          headers: headers,
          body: JSON.stringify(payload)
      };

      // Make the fetch request
      const response = await fetch(url, options);
      const data = await response.json(); // Parse JSON response

      console.log('Response:', data);
      return data; // Return the data for further processing
  } catch (error) {
      // Log errors and optionally rethrow or handle them differently
      console.error('Error:', error.message);
      throw error; // Rethrow if you want calling function to handle it
  }
}

// Example payload
const examplePayloadRequest ={
  "sender": {
      "businessName": "Name of bank",
      "businessId": "Héloïse D'arban"
  },
  "destination": {
      "accountBank": "Name of bank",
      "accountName": "Héloïse D'arban",
      "accountNumber": "1111111111",
      "accountType": "bank",
      "networkId": "6df48502-1ebe-473f-be17-e2cae4dd67ee",
      "networkName": "Zenith Bank"
  },
  "channelId": "fe8f4989-3bf6-41ca-9621-ffe2bc127569",
  "sequenceId": "00f000-0000002-000000-000002713",
  "amount": 50,
  "currency": "NGN",
  "country": "NG",
  "reason": "other",
  "forceAccept": false,
  "partnerId": "8a155d8d-1a05-4b27-b3d4-fb4455eb1cd8",
  "requestSource": "api",
  "id": "1701884b-2ad5-5943-a05c-18843613d964",
  "attempt": 1,
  "status": "created",
  "convertedAmount": 79000,
  "rate": 1580,
  "expiresAt": "2025-01-14T14:40:28.773Z",
  "settlementInfo": {},
  "createdAt": "2025-01-14T14:30:28.774Z",
  "updatedAt": "2025-01-14T14:30:28.774Z",
  "directSettlement": false
}



export async function submitCollectionRequest(payload){
  try{
    const url = 'https://sandbox.api.yellowcard.io/business/collections';

    const method = 'POST'
      // Current timestamp
      const date = new Date().toISOString();

      // Create the HMAC object
      const hmac = crypto.algo.HMAC.create(crypto.algo.SHA256, secretKey);

      // Update HMAC with necessary data
      hmac.update(date);
      hmac.update('/business/collections'); // Path of the URL
      hmac.update(method);

      // Hash and include the body if it is not empty
      if (payload) {
          const bodyString = JSON.stringify(payload);
          const bodyHash = crypto.SHA256(bodyString).toString(crypto.enc.Base64);
          hmac.update(bodyHash);
      }

      // Finalize the HMAC and encode in Base64
      const signature = hmac.finalize().toString(crypto.enc.Base64);

      // Set up headers
      const headers = {
          'Content-Type': 'application/json',
          'X-YC-Timestamp': date,
          'Authorization': `YcHmacV1 ${apiKey}:${signature}`
      };

      // Set up the fetch request
      const options = {
          method: method,
          headers: headers,
          body: JSON.stringify(payload)
      };

      // Make the fetch request
      const response = await fetch(url, options);
      const data = await response.json(); // Parse JSON response

      console.log('Response:', data);
      return data; // Return the data for further processing

  }catch(error){
    console.log("yellowCard.submitCollectionRequest.",error.message)
  }
}


export async function acceptPaymentRequest(id,payload=null){
  try{
    const url = `https://sandbox.api.yellowcard.io/business/collections/${id}/accept`;

    const method = 'POST'
      // Current timestamp
      const date = new Date().toISOString();

      // Create the HMAC object
      const hmac = crypto.algo.HMAC.create(crypto.algo.SHA256, secretKey);
      console.log("here is the id that is coming ",id)
      // Update HMAC with necessary data
      hmac.update(date);
      hmac.update(`/collection/${String(id)}/accept`); // Path of the URL
      hmac.update(method);

      // Hash and include the body if it is not empty
      if (payload) {
        console.log("coming oin the paytload block")
          const bodyString = JSON.stringify(payload);
          const bodyHash = crypto.SHA256(bodyString).toString(crypto.enc.Base64);
          hmac.update(bodyHash);
      }

      // Finalize the HMAC and encode in Base64
      const signature = hmac.finalize().toString(crypto.enc.Base64);
      // const signature = "ycapidocsignature"
      // Set up headers
      const headers = {
          'Content-Type': 'application/json',
          'X-YC-Timestamp': date,
          'Authorization': `YcHmacV1 ${apiKey}:${signature}`
      };

      // Set up the fetch request
      const options = {
          method: method,
          headers: headers
      };

      // Make the fetch request
      const response = await fetch(url, options);
      const data = await response.json(); // Parse JSON response

      console.log('acceptCollectionRequest:Response', data);
      return data; // Return the data for further processing

  }catch(error){
    console.log("yellowCard.acceptCollectionRequest.",error.message)
  }
}


