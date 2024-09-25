import CryptoJS from "crypto-js";
import db from "../models/index";
import { createNewRecord, findOneAndUpdate } from "../Dao/dao";
const { Network, Coin, Usdt } = db;
async function generatePayloadAndSignature(secret, body) {
  const timestamp = Date.now().toString();
  const obj = {
    body,
    timestamp,
  };
  const payload = CryptoJS.enc.Base64.stringify(
    CryptoJS.enc.Utf8.parse(JSON.stringify(obj))
  );
  const signature = CryptoJS.enc.Hex.stringify(
    CryptoJS.HmacSHA512(payload, secret)
  );
  return { payload, signature };
}
export async function usdtMarketPlace() {
  try {
    // 1 herer is the body
    const body = {
      customerId: "",
      email: "tshubhanshu007@gmail.com",
      phoneNumber: "+918318089088",
      clientCustomerId: "1255377",
      type: "INDIVIDUAL",
      kycRedirectUrl: "",
      closeAfterLogin: true,
    };

    // 2.this is header
    const apiKey = process.env.apiKey;
    const secret = process.env.secret;
    // 3. making signature
    const { payload, signature } = await generatePayloadAndSignature(
      secret,
      body
    );

    // 4. this is header
    const headers = {
      apikey: apiKey,
      payload: payload,
      signature: signature,
    };

    const headers2 = {
      apiKey: apiKey,
      payload: payload,
      signature: signature,
    };
    console.log(headers2);
    const response = await fetch(
      "https://api.onramp.money/onramp/api/v2/whiteLabel/kyc/url",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: apiKey,
          payload: payload,
          signature: signature,
        },
        body: JSON.stringify(body),
      }
    );
    console.log(response);

    const data = await response.json();
    console.log("this is response datatatattatata", data);
  } catch (err) {}
}

export async function getAllCoinsData() {
  try {
    const response = await fetch(
      "https://api.onramp.money/onramp/api/v3/buy/public/listAllCoins"
    );
    const coins = response.json();
    if (coins) return coins;
    else return [];
  } catch (error) {
    console.log("coins error", error);
    return [];
  }
}

export async function getAllNetworkData() {
  try {
    const data = await Network.findAll();
    if(data.length>0)
    {

        return data
    }
    const apiKey = process.env.apiKey;
    const secret = process.env.secret;
    let body = {};
    // 3. making signature
    const { payload, signature } = await generatePayloadAndSignature(
      secret,
      body
    );
    const headers = {
      apiKey: apiKey,
      payload: payload,
      signature: signature,
    };
    const response = await fetch(
      "https://api.onramp.money/onramp/api/v2/common/transaction/allGasFee",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: apiKey,
          payload: payload,
          signature: signature,
        },
        body: JSON.stringify(body),
      }
    );
    const networkData = await response.json();
   // console.log("network data",networkData)

    const networkEntries = [];
    // Loop through each coinId in the data
    //console.log('data', data)
   
      for (const coinId in networkData.data) {
        const networks = networkData.data[coinId];

        // Loop through each networkId for that coinId
        for (const networkId in networks) {
          const {
            withdrawalFee,
            minimumWithdrawal,
            nodeInSync,
            depositEnable,
          } = networks[networkId];

          // Prepare each network entry to save
          if(coinId&&networkId&&withdrawalFee&&minimumWithdrawal&&nodeInSync&&depositEnable)
          {

              networkEntries.push({
                  coinid: parseInt(coinId), // Make sure to convert string coinId to integer
                  networkId: parseInt(networkId), // Convert networkId to integer
                  withdrawalFee: parseFloat(withdrawalFee),
                  minimumWithdrawal: parseFloat(minimumWithdrawal),
                  nodeInSync: Boolean(nodeInSync),
                  depositEnable: Boolean(depositEnable),
                });
            }
        }
      }
      //console.log(networkEntries)
      // Bulk create the entries in the Network model
      const existingCoins = await Coin.findAll({
        attributes: ['coinid'],
        raw: true,
     });
     const existingCoinIds = existingCoins.map(coin => coin.coinid);
     const filteredNetworkEntries = networkEntries.filter(entry =>
        existingCoinIds.includes(entry.coinid)
    );
      await Network.bulkCreate(filteredNetworkEntries);
    
    if (networkEntries) return filteredNetworkEntries;
    else return [];
  } catch (error) {
    console.log("network error", error);
    return [];
  }
}

export async function getQuotes(details) {
  try {
    const { fromCurrency, toCurrency, fromAmount, chain, paymentMethodType } = details
    const apiKey = process.env.apiKey;
    const secret = process.env.secret;
    const body = {
      fromCurrency: fromCurrency,
      toCurrency: toCurrency,
      fromAmount: fromAmount,
      chain: chain,
      paymentMethodType: paymentMethodType
    }
    console.log(body)


    // Create the payload and signature
    const { payload, signature } = await generatePayloadAndSignature(
      secret,
      body
    );
    const headers = {
      "Content-Type": "application/json",
      apiKey: apiKey,
      payload: payload,
      signature: signature,
    };


    const url =
      "https://api.onramp.money/onramp/api/v2/whiteLabel/onramp/quote"

    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      // Handle HTTP errors, e.g., 404, 500, etc.
       const errResponse = await response.json()
            console.log(errResponse)
            throw new Error(`${errResponse.error}`);
    }

    const data = await response.json();
    console.log(data);
    if(data.data.rate)
    {
      const query ={
        id:1
      }
      const updateObj ={
        inrRate:data.data.rate
      }
      const response = await Usdt.findAll()
      if(response?.length>0)
      {
        findOneAndUpdate(Usdt,query,updateObj)
      }else{
        createNewRecord(Usdt,updateObj)
      }
    }

    return data

  } catch (error) {
    //logger.error("user.controller.getQuotes", error.message)
    console.log('usdtapi.getQUotes', error.message)
    return error

  }
}

export async function getQuotesOfframp(details) {
  try {
    const { fromCurrency, toCurrency, fromAmount, chain } = details
    const apiKey = process.env.apiKey;
    const secret = process.env.secret;
    const body = {
      fromCurrency: fromCurrency,
      toCurrency: toCurrency,
      fromAmount: fromAmount,
      chain: chain,
    }
    console.log(body)


    // Create the payload and signature
    const { payload, signature } = await generatePayloadAndSignature(
      secret,
      body
    );
    const headers = {
      "Content-Type": "application/json",
      apiKey: apiKey,
      payload: payload,
      signature: signature,
    };


    const url =
      "https://api.onramp.money/onramp/api/v2/whiteLabel/offramp/quote"

    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      // Handle HTTP errors, e.g., 404, 500, etc.
       const errResponse = await response.json()
            console.log(errResponse)
            throw new Error(`${errResponse.error}`);
    }

    const data = await response.json();
    console.log(data);
    if(data.data.rate)
    {
      const query ={
        id:1
      }
      const updateObj ={
        inrRateOfframp:data.data.rate
      }
      const response = await Usdt.findAll()
      if(response?.length>0)
      {
        findOneAndUpdate(Usdt,query,updateObj)
      }else{
        createNewRecord(Usdt,updateObj)
      }
    }

    return data

  } catch (error) {
    //logger.error("user.controller.getQuotes", error.message)
    console.log('usdtapi.getQUotes', error.message)
    return error

  }
}
