import cryptoJs from "crypto-js";
import db from "../models/index.js";
import { compare, encrypt } from "../utils/password.util.js";
import logger from "../utils/logger.util.js";
import { getAllCoinsData, getAllNetworkData } from "../ApiCalls/usdtapicalls.js";
import {
    responseMapping,
    responseMappingError,
    responseMappingWithData,
} from "../utils/responseMapper.js";
import { Currencies } from "../utils/currencies.js";
import { networks } from "../utils/networks.js";
import { createNewRecord, findRecord } from "../Dao/dao.js";

const { User, Coin, OnRampTransaction, OffRampTransaction, FiatAccount } = db;

export async function AddFiatAccountId(request, reply) {
    try {
        const apiKey = process.env.apiKey;
        const secret = process.env.secret;

        const { fiatAccount, ifsc } = request.body

        if (!request.user.isKycCompleted) {
            return reply.status(500).send(responseMappingError(500, "Please complete your kyc"))
        }

        let body = {
            fiatAccount: fiatAccount,
            customerId: request.user.customerId,
            ifsc: ifsc
        }


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


        const url =
            "https://api-test.onramp.money/onramp/api/v2/whiteLabel/bank/addFiatAccount"
        const response = await fetch(url, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            // Handle HTTP errors, e.g., 404, 500, etc.
            console.log(await response.json())
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();


        console.log(data);
        const create_fiat_account = { user_id: request.user.id, fiatAccountId: data.data.fiatAccountId, fiatAccount: fiatAccount, ifsc: ifsc }

        if (data.code === 200) {
            await createNewRecord(FiatAccount, create_fiat_account)
        }
        return reply
            .status(200)
            .send(responseMappingWithData(200, "success", data.data));

    } catch (error) {
        console.log("this is error", error.message)
        return reply.status(500).send(responseMappingError(500, error.error))
    }
}


export async function getAllFiatAccount(request, reply) {
    try {
        const user_id = request.user.id
        const { limit, skip } = request.query
        const obj = {
            where: {
                user_id: request.user.id
            },
            limit: limit,
            offset: skip,
            order: [["createdAt", "DESC"]],
        }
        const all_fiat_account = await findRecord(FiatAccount, obj)
        return reply.status(200).send(responseMappingWithData(200, "success", all_fiat_account))

    } catch (error) {
        console.log("this is error", error.message)
        return reply.status(500).send(responseMappingError(500, `Internal server error`))
    }

}

export async function offRampRequest(request, reply) {
    try {
        const apiKey = process.env.apiKey;
        const secret = process.env.secret;

        const { fromCurrency, toCurrency, chain, fiatAccountId, fromAmount, toAmount, rate } = request.body

        // if (!request.user.isKycCompleted) {
        //     return reply.status(500).send(responseMappingError(500, "Please complete your kyc"))
        // }
        // if (request.user.fiatAccountId === null) {
        //     return reply.status(500).send(responseMappingError(500, "Please create fiat account"))
        // }
        let body = {
            fromCurrency: fromCurrency,
            toCurrency: toCurrency,
            chain: chain,
            fiatAccountId: fiatAccountId,
            customerId: request.user.customerId,
            fromAmount: fromAmount,
            toAmount: toAmount,
            rate: rate
        }
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
        const url =
            "https://api-test.onramp.money/onramp/api/v2/whiteLabel/offramp/createTransaction"
        const response = await fetch(url, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(body),
        });
        if (!response.ok) {
            // Handle HTTP errors, e.g., 404, 500, etc.
            console.log("here", await response.json())
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log("data check", data);

        body.user_id = request.user.id,
            body.reference_id = data.data.transactionId

        const transaction = await OffRampTransaction.create(body)

        return reply
            .status(200)
            .send(responseMappingWithData(200, "success", data.data));
    } catch (error) {
        console.log("this is error", error.message)
        return reply.status(500).send(responseMappingError(500, `${error.message}`))
    }
}

export async function getAllOffRamp(request, reply) {
    try {
        const { limit = 10, skip = 0 } = request.query
        const all_off_ramp = await OffRampTransaction.findAll({
            where: {
                user_id: request.user.id
            },
            limit: limit,
            offset: skip,
            order: [["createdAt", "DESC"]],
        })
        return reply.status(200).send(responseMappingWithData(200, "Success", all_off_ramp))
    } catch (error) {
        console.log('user.controller.getQUotes', error.message)
        return reply.status(500).send(responseMapping(500, `Internal server error`))
    }
}

export async function getQuotes(request, reply) {
    try {
        const { fromCurrency, toCurrency, fromAmount, chain, paymentMethodType } = request.body
        const apiKey = process.env.apiKey;
        const secret = process.env.secret;

        const body = {
            fromCurrency: fromCurrency,
            toCurrency: toCurrency,
            fromAmount: fromAmount,
            chain: chain,
            paymentMethodType: paymentMethodType
        }
        //   const dataNet = networks
        //   let updatedData = []
        //   const coinData = await Coin.findOne({
        //     where: {
        //       coinid: 54
        //     }
        //   })
        //   const networkData = await getAllNetworkData()
        //   const filteredNetworks = networkData.filter(item => item.coinid == 54)
        //   //console.log("network data",filteredNetworks)
        //   //console.log(coinData)
        //   let query ={
        //     id:1
        //   }
        //   const usdt = await findRecord(Usdt,query)
        //     if (coinData) {
        //       dataNet.map((item) => {
        //       const networkData = filteredNetworks.filter(Item => Item.networkId == item.chainId)
        //       //console.log("here", networkData)
        //       if (networkData[0]?.withdrawalFee) {

        //         updatedData.push({
        //           ...item,
        //           icon: coinData.coinIcon,
        //           fee: networkData[0]?.withdrawalFee,
        //           minBuy: networkData[0]?.minimumWithdrawal,
        //           minBuyInRupee: usdt?.inrRate ? Math.ceil(Number(networkData[0]?.minimumWithdrawal) * usdt?.inrRate) : Math.ceil(networkData[0]?.minimumWithdrawal)
        //         })
        //       }
        //     })
        //   }
        //   const minWithdrawl = updatedData.find((item)=> item.chainSymbol == chain)
        //   console.log(minWithdrawl)
        //   if(minWithdrawl.minBuyInRupee>fromAmount)
        //   return reply.status(500).send(responseMappingError(400, `Amount should be greater than ${minWithdrawl.minBuyInRupee}`))
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


        const url =
            "https://api-test.onramp.money/onramp/api/v2/whiteLabel/offramp/quote"

        const response = await fetch(url, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            // Handle HTTP errors, e.g., 404, 500, etc.
            console.log(await response.json())
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        let data = await response.json();
        console.log(data);
        console.log(data?.data?.fees, data?.data?.rate)
        if (data.data) {
            let updatedData = data.data
            updatedData.feeInUsdt = (Number(data?.data?.fees[0]?.tdsFee) / Number(data?.data?.rate)).toFixed(2)
            return reply
                .status(200)
                .send(responseMappingWithData(200, "success", updatedData));
        } else {
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

