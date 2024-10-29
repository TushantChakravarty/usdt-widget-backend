import db from "../models/index.js";
import logger from "../utils/logger.util.js";
import cryptoJs from "crypto-js";
import { getAllCoinsData, getAllNetworkData, getWithdrawFee } from "../ApiCalls/usdtapicalls.js";
import {
  responseMapping,
  responseMappingError,
  responseMappingWithData,
} from "../utils/responseMapper.js";
import { networks } from "../utils/networks.js";
import { findOneAndUpdate, findRecord } from "../Dao/dao.js";
import { createPayinBankRequest, generateToken } from "../ApiCalls/payhub.js";
import { transferUSDT, tronWeb} from "../utils/tronUtils.js";

const { User, Coin, OnRampTransaction, Usdt } = db;

export async function getAllOnRampTransaction(request, reply) {
    try {
        const { limit = 100, skip = 0 } = request.query
        const all_on_ramp = await OnRampTransaction.findAll({
            where: {
                user_id: request.user.id
            },
            limit: limit,
            offset: skip,
            attributes: { exclude: ['time'] },  // Exclude 'time' property from the response
            // order: [["date", "DESC"]], // Use 'date' if needed for sorting
        
            order: [["date", "DESC"]],
        })

        return reply.status(200).send(responseMappingWithData(200, "Success", all_on_ramp))

    } catch (error) {
        logger.error("user.controller.getQuotes", error.message)
        console.log('user.controller.getQUotes', error.message)
        return reply.status(500).send(responseMapping(500, `Internal server error`))

    }
}

export async function onRampRequest(request, reply) {
    try {
      const { fromCurrency, toCurrency, chain, paymentMethodType, depositAddress, fromAmount, toAmount, rate } = request.body
  
    //   if (!request.user.isKycCompleted) {
    //     return reply.status(500).send(responseMappingError(500, "Please complete your kyc"))
    //   }
      const dataNet = networks
      let updatedData = []
      const coinData = await Coin.findOne({
        where: {
          coinid: 54
        }
      })
      const networkData = await getAllNetworkData()
      const filteredNetworks = networkData.filter(item => item.coinid == 54)
      //console.log("network data",filteredNetworks)
      //console.log(coinData)
      let query ={
        id:1
      }
      const usdt = await findRecord(Usdt,query)
        if (coinData) {
          dataNet.map((item) => {
          const networkData = filteredNetworks.filter(Item => Item.networkId == item.chainId)
          //console.log("here", networkData)
          if (networkData[0]?.withdrawalFee) {
  
            updatedData.push({
              ...item,
              icon: coinData.coinIcon,
              fee: networkData[0]?.withdrawalFee,
              minBuy: networkData[0]?.minimumWithdrawal,
              minBuyInRupee: usdt?.inrRate ? Math.ceil(Number(networkData[0]?.minimumWithdrawal) * usdt?.inrRate) : Math.ceil(networkData[0]?.minimumWithdrawal)
            })
          }
        })
      }
      const minWithdrawl = updatedData.find((item)=> item.chainSymbol == chain)
      console.log(minWithdrawl)
      if(minWithdrawl.minBuyInRupee>fromAmount)
      return reply.status(500).send(responseMappingError(400, `Amount should be greater than ${minWithdrawl.minBuyInRupee}`))
  
      let body = {
        fromCurrency: fromCurrency,
        toCurrency: toCurrency,
        chain: chain,
        paymentMethodType: paymentMethodType,
        depositAddress: depositAddress,
        customerId: request.user.customerId,
        fromAmount: fromAmount,
        toAmount: toAmount,
        rate: rate
      }
  
     const userData = await generateToken()
   
     const phone = request.user.phone.replace("+91-", "");

     let bodyPayin ={
        "emailId": process.env.payhubUsername,
        "amount": fromAmount,
        "username": request.user.email,
        "customer_email": request.user.email,
        "phone":phone
     }
     const response = await createPayinBankRequest(userData.responseData,bodyPayin)
     console.log("resp check",response)
     
      if(response?.responseData?.transaction_id)
      {
        let updateObj = {
            ...body,
            phone:bodyPayin.phone
          }
  
        updateObj.user_id = request.user.id,
        updateObj.reference_id = response.responseData.transaction_id
        
        const transaction = await OnRampTransaction.create(updateObj)
        if(transaction)
        {

            return reply
            .status(200)
            .send(responseMappingWithData(200, "success", response.responseData));
        }else{
            return reply.status(500).send(responseMappingError(500, "Unable to process your request at the moment"))
            
        }
    }
    } catch (error) {
      console.log("this is error", error.message)
      return reply.status(500).send(responseMappingError(500, `internal server error`))
    }
  }
  
  export async function getQuotes(request, reply) {
    try {
      const { fromCurrency, toCurrency, fromAmount, chain, paymentMethodType } = request.body
      const apiKey = process.env.apiKey;
      const secret = process.env.secret;
      let body ={
        fromCurrency: fromCurrency,
        toCurrency: toCurrency,
        fromAmount: fromAmount,
        chain: chain,
        paymentMethodType: paymentMethodType
      }
      const dataNet = networks
      let updatedData = []
      const coinData = await Coin.findOne({
        where: {
          coinid: 54
        }
      })
      const networkData = await getAllNetworkData()
      const filteredNetworks = networkData.filter(item => item.coinid == 54)
    
      let query ={
        id:1
      }
      const usdt = await findRecord(Usdt,query)
        if (coinData) {
          dataNet.map((item) => {
          const networkData = filteredNetworks.filter(Item => Item.networkId == item.chainId)
          //console.log("here", networkData)
          if (networkData[0]?.withdrawalFee) {
  
            updatedData.push({
              ...item,
              icon: coinData.coinIcon,
              fee: networkData[0]?.withdrawalFee,
              minBuy: networkData[0]?.minimumWithdrawal,
              minBuyInRupee: usdt?.inrRate ? Math.ceil(Number(networkData[0]?.minimumWithdrawal) * usdt?.inrRate) : Math.ceil(networkData[0]?.minimumWithdrawal)          })
          }
        })
      }
      const minWithdrawl = updatedData.find((item)=> item.chainSymbol == chain)
      if(minWithdrawl.minBuyInRupee>fromAmount)
      return reply.status(500).send(responseMappingError(400, `Amount should be greater than ${minWithdrawl.minBuyInRupee}`))
      const timestamp = Date.now().toString();
      const obj = {
        body,
        timestamp,
      };
  
      // Create the payload and signature
      const payload = cryptoJs.enc.Base64.stringify(
        cryptoJs.enc.Utf8.parse(JSON.stringify(obj))
      );
      const signature = cryptoJs.enc.Hex.stringify(
        cryptoJs.HmacSHA512(payload, secret)
      );
  
      // Create the headers
      const headers = {
        "Content-Type": "application/json",
        apiKey: apiKey,
        payload: payload,
        signature: signature,
      };
  
      const cachedData =await request.server.redis.get(`${fromCurrency}-${toCurrency}-${fromAmount}-${chain}-${paymentMethodType}`)
  
      if(cachedData){
        let data_cache = await JSON.parse(cachedData);
        console.log(data_cache);
        if(data_cache.data)
        {
          let updatedData = data_cache.data
          updatedData.feeInUsdt = Number(data_cache?.data?.fees[0]?.gasFee)/Number(data_cache?.data?.rate)
          return reply
          .status(200)
          .send(responseMappingWithData(200, "success", updatedData));
      }
      }
  
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
  
      let data = await response.json();
      console.log(data);
  
     const enter = await request.server.redis.set(`${fromCurrency}-${toCurrency}-${fromAmount}-${chain}-${paymentMethodType}`,JSON.stringify(data), 'EX', 7200);
      if(data.data)
      {
        let updatedData = data.data
        updatedData.feeInUsdt = Number(data?.data?.fees[0]?.gasFee)/Number(data?.data?.rate)
        return reply
        .status(200)
        .send(responseMappingWithData(200, "success", updatedData));
      }else{
        return reply
        .status(200)
        .send(responseMappingWithData(200, "success", 0));
      }
  
    } catch (error) {
      logger.error("user.controller.getQuotes", error.message)
      console.log('user.controller.getQUotes', error.message)
      return reply.status(500).send(responseMappingError(500, `${error.message}`))
  
    }
  }

  export async function verifyTransaction(request, reply) {
    try {
      const { reference_id } = request.body
      const data =  await findRecord(OnRampTransaction,{
        reference_id
      })
      console.log(data)
      if(data?.status=="PENDING")
      {
        return reply.status(500).send(responseMappingError(500, "please complete the payment first"))

      }
      if(data?.status=="SUCCESS"&&data?.txHash)
      {
        return reply.status(500).send(responseMappingError(500, "Crypto has already been processed"))

      }

      if(data?.status=="FAILED")
      {
        return reply.status(500).send(responseMappingError(500, "Your payment hast failed"))

      }



      if(data?.status=='SUCCESS'&&!data?.txHash)
      {
        console.log('money transferred')
        const amountInSun = tronWeb.toSun(data.toAmount)
        const transaction = await transferUSDT(data.depositAddress,amountInSun)
        console.log('tx check', transaction)
        if(transaction.status=="success"&&transaction.txHash)
        {
          const updateTx = await findOneAndUpdate(OnRampTransaction,{
            reference_id
          },{
            txHash:transaction.txHash,
            txStatus:"SUCCESS",
            amountTransferred:transaction.amount
          })
          console.log(updateTx)

          if(updateTx)
          {

            return reply
            .status(200)
            .send(responseMappingWithData(200, "success", {status:updateTx.txStatus, txHash:transaction.txHash, amountTransferred:transaction.amount}));
          }
        }else{
          return reply
            .status(200)
            .send(responseMappingWithData(200, "success", {status:"failed", txHash:transaction.txHash}));
        }
      }else{
        return reply.status(500).send(responseMappingError(500, "Unable to process your request at the moment"))
      }
    }catch(error)
    {
      console.log("on ramp verify", error.message)
      return reply.status(500).send(responseMappingError(500, `internal server error`))
    }
  }

  export async function verifyTransactionDetails(details) {
    try {
      const { reference_id } = details
      const data =  await findRecord(OnRampTransaction,{
        reference_id
      })
      console.log(data)
      if(data?.status=="PENDING")
      {
        return reply.status(500).send(responseMappingError(500, "please complete the payment first"))

      }
      if(data?.status=="SUCCESS"&&data?.txHash)
      {
        return reply.status(500).send(responseMappingError(500, "Crypto has already been processed"))

      }

      if(data?.status=="FAILED")
      {
        return reply.status(500).send(responseMappingError(500, "Your payment hast failed"))

      }



      if(data?.status=='SUCCESS'&&!data?.txHash)
      {
        console.log('money transferred')
        const amountInSun = tronWeb.toSun(data.toAmount)
        const transaction = await transferUSDT(data.depositAddress,amountInSun)
        console.log('tx check', transaction)
        if(transaction.status=="success"&&transaction.txHash)
        {
          console.log(transaction)
          const updateTx = await findOneAndUpdate(OnRampTransaction,{
            reference_id
          },{
            txHash:transaction.txHash,
            txStatus:"SUCCESS",
            amountTransferred:transaction.amount
          })
          console.log(updateTx)

          if(updateTx)
          {
            return {status:updateTx.txStatus, txHash:transaction.txHash, amountTransferred:transaction.amount}
            // return reply
            // .status(200)
            // .send(responseMappingWithData(200, "success", {status:updateTx.txStatus, txHash:transaction.txHash, amountTransferred:transaction.amount}));
          }
        }else{
          return {status:"failed", txHash:transaction.txHash}
          // return reply
          //   .status(200)
          //   .send(responseMappingWithData(200, "success", {status:"failed", txHash:transaction.txHash}));
        }
      }else{
        return "Unable to process your request at the moment"
        // return reply.status(500).send(responseMappingError(500, "Unable to process your request at the moment"))
      }
    }catch(error)
    {
      console.log("on ramp verify", error.message)
      return error
      // return reply.status(500).send(responseMappingError(500, `internal server error`))
    }
  }
  