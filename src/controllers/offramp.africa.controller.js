import db from "../models/index.js";

import {
  responseMapping,
  responseMappingError,
  responseMappingWithData,
} from "../utils/responseMapper.js";
import { getChannelsAfrica, getRatesAfrica } from "../gateways/yellowCard.js";
import { findRecordNew, getFee } from "../Dao/dao.js";
const {
  User,
  Coin,
  OnRampTransaction,
  OffRampTransaction,
  FiatAccount,
  Payout,
  Usdt,
} = db;

export async function getChannels(request, reply) {
  try {
    const cacheKey = "africa-channels-data";
    
    // Check if data is in Redis cache
    const cachedData = await request.server.redis.get(cacheKey);
    
    if (cachedData) {
      return reply
        .status(200)
        .send(responseMappingWithData(200, "Success", JSON.parse(cachedData)));
    }

    // Fetch data if not in cache
    const channels = await getChannelsAfrica('offramp');
    
    if (channels) {
      // Store in Redis with expiration time of 2 hours (7200 seconds)
      await request.server.redis.set(cacheKey, JSON.stringify(channels), "EX", 60);
      
      return reply
        .status(200)
        .send(responseMappingWithData(200, "Success", channels));
    }
  } catch (error) {
    return reply
      .status(500)
      .send(responseMapping(500, "Internal server error"));
  }
}

export async function getRates(request, reply) {
  try {
    const currency = request?.body?.currency
    const fromAmount = request?.body?.fromAmount
    //console.log('currency',currency)
    const cacheKey = `africa-rates-data-${currency}-fiat-${fromAmount}`;
    
    // Check if data is in Redis cache
    const cachedData = await request.server.redis.get(cacheKey);
    
    if (cachedData) {
      return reply
        .status(200)
        .send(responseMappingWithData(200, "Success", JSON.parse(cachedData)));
    }
    
    // Fetch data if not in cache
    let cleanedCurrency = currency.replace(/['"]+/g, '');
    const rates = await getRatesAfrica("fiat",cleanedCurrency);
    
    if (rates) {
      let query = {
        id: 1,
      };
          const usdt = await findRecordNew(Usdt, query);
           const usdtRate = Number(rates[0]?.sell)//usdt.inrRateOfframp; // constant exchange rate
              let onrampFeePercentage, gatewayFeePercentage, tdsFeePercentage;
          
              // Conditional percentages based on fromAmount
              const feeData = await getFee();
              if (fromAmount === 10) {
                onrampFeePercentage = feeData
                  ? feeData?.offrampFee?.offrampFeePercentage
                  : 0.3;
                gatewayFeePercentage = feeData
                  ? feeData?.offrampFee?.gatewayFeePercentage
                  : 0.96;
                tdsFeePercentage = feeData
                  ? feeData?.offrampFee?.tdsFeePercentage
                  : 1.003;
              } else if (fromAmount > 10) {
                onrampFeePercentage = feeData
                  ? feeData?.offrampFee?.offrampFeePercentage
                  : 0.272;
                gatewayFeePercentage = feeData
                  ? feeData?.offrampFee?.gatewayFeePercentage
                  : 0.943;
                tdsFeePercentage = feeData
                  ? feeData?.offrampFee?.tdsFeePercentage
                  : 0.988;
              } else {
                // Set default values if needed
                onrampFeePercentage = feeData
                  ? feeData?.offrampFee?.offrampFeePercentage
                  : 0.3;
                gatewayFeePercentage = feeData
                  ? feeData?.offrampFee?.gatewayFeePercentage
                  : 0.96;
                tdsFeePercentage = feeData
                  ? feeData?.offrampFee?.tdsFeePercentage
                  : 1.003;
              }
          
              // Calculate fees
              const onrampFee = fromAmount * (onrampFeePercentage / 100) * usdtRate;
              const gatewayFee = fromAmount * (gatewayFeePercentage / 100) * usdtRate;
              const tdsFee = fromAmount * (tdsFeePercentage / 100) * usdtRate;
          
              // Calculate final amount after fees
              const toAmountOfframp =
                fromAmount * rates[0]?.sell - (onrampFee + gatewayFee + tdsFee);
          
              // // Log results
              // console.log("Total Fees:", onrampFee + gatewayFee + tdsFee);
              // console.log("Converted Amount:", fromAmount * usdtRate);
              // console.log("Fees Breakdown:", { onrampFee, gatewayFee, tdsFee });
             // console.log("Final Amount:", toAmountOfframp);
              const offrampAmount = {
                status: 1,
                code: 200,
                data: {
                  fromCurrency: "usdt",
                  toCurrency: currency,
                  fromAmount: fromAmount,
                  toAmount: toAmountOfframp.toFixed(2),
                  rate: rates[0]?.sell,
                  fees: [
                    {
                      type: "fiat",
                      onrampFee: onrampFee.toFixed(2),
                      gatewayFee: gatewayFee.toFixed(2),
                      tdsFee: tdsFee.toFixed(2),
                    },
                  ],
                },
              };
             // console.log(offrampAmount);
          
      
      // Store in Redis with expiration time of 2 hours (7200 seconds)
      await request.server.redis.set(cacheKey, JSON.stringify(offrampAmount), "EX", 60);
      
      return reply
        .status(200)
        .send(responseMappingWithData(200, "Success", offrampAmount));
    }
  } catch (error) {
    console.log('error rates africa',error)
    return reply
      .status(500)
      .send(responseMapping(500, "Internal server error"));
  }
}



export async function getNetwork(request,reply){
  try{
    const networks = await getNetworks()
    return reply
    .status(200)
    .send(responseMappingWithData(200, "Success", networks));

  }catch(error){
    return reply
    .status(500)
    .send(responseMapping(500, "Internal server error"));
  }
}
