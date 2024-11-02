import cryptoJs from "crypto-js";
import db from "../models/index.js";
import { compare, encrypt } from "../utils/password.util.js";
import logger from "../utils/logger.util.js";
import {
  getAllCoinsData,
  getAllNetworkData,
} from "../ApiCalls/usdtapicalls.js";
import {
  responseMapping,
  responseMappingError,
  responseMappingWithData,
} from "../utils/responseMapper.js";
import { Currencies } from "../utils/currencies.js";
import { networks } from "../utils/networks.js";
import {
  createNewRecord,
  findAllRecord,
  findOneAndUpdate,
  findRecord,
} from "../Dao/dao.js";
import { ethers } from "ethers";
import {
  TronWeb,
  utils as TronWebUtils,
  Trx,
  TransactionBuilder,
  Contract,
  Event,
  Plugin,
} from "tronweb";
import QRCode from "qrcode";
import { generateRandomFiatId, generateTransactionId } from "../utils/utils.js";
// import {
//   createPayoutBankRequest,
//   generateToken,
// } from "../ApiCalls/globalpay.js";
import { tronWeb, walletAddress } from "../utils/tronUtils.js";
import { createPayoutBankRequestPayhub, generateToken } from "../ApiCalls/payhub.js";

const {
  User,
  Coin,
  OnRampTransaction,
  OffRampTransaction,
  FiatAccount,
  Payout,
  Usdt
} = db;



export async function AddFiatAccountId(request, reply) {
  try {
    const apiKey = process.env.apiKey;
    const secret = process.env.secret;
    const { fiatAccount, ifsc, bankName } = request.body;
    // if (!request.user.isKycCompleted) {
    //     return reply.status(500).send(responseMappingError(500, "Please complete your kyc"))
    // }
    const fiat_account_exist = await FiatAccount.findOne({
      where: { fiatAccount: fiatAccount },
    });
    if (
      fiat_account_exist &&
      request.user.id === fiat_account_exist.user_id &&
      fiat_account_exist.delete === false
    ) {
      return reply
        .status(500)
        .send(
          responseMappingError(500, "You already have a fiat account with this")
        );
    }
    if (
      fiat_account_exist &&
      request.user.id === fiat_account_exist.user_id &&
      fiat_account_exist.delete === true
    ) {
      fiat_account_exist.delete = false;
      await fiat_account_exist.save();
      return reply
        .status(200)
        .send(responseMappingWithData(200, "success", "success"));
    }
    if (fiat_account_exist && fiat_account_exist.delete === false) {
      return reply
        .status(500)
        .send(responseMappingError(500, "This account already in use"));
    }
    if (fiat_account_exist && fiat_account_exist.delete === true) {
      fiat_account_exist.delete = false;
      fiat_account_exist.user_id = request.user.id;
      await fiat_account_exist.save();
      return reply
        .status(200)
        .send(responseMappingWithData(200, "success", "success"));
    }
    let body = {
      fiatAccount: fiatAccount,
      customerId: request.user.customerId,
      ifsc: ifsc,
    };
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
      "https://api.onramp.money/onramp/api/v2/whiteLabel/bank/addFiatAccount";
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      // Handle HTTP errors, e.g., 404, 500, etc.
      const errResponse = await response.json();
      console.log(errResponse);
      throw new Error(`${errResponse.error}`);
    }

    const data = await response.json();

    const create_fiat_account = {
      user_id: request.user.id,
      fiatAccountId: data.data.fiatAccountId,
      fiatAccount: fiatAccount,
      ifsc: ifsc,
      bank_name: bankName,
    };

    if (data.code === 200) {
      await createNewRecord(FiatAccount, create_fiat_account);
    }
    return reply
      .status(200)
      .send(responseMappingWithData(200, "success", data.data));
  } catch (error) {
    return reply.status(500).send(responseMappingError(500, error.message));
  }
}

export async function AddFiatAccountOfframp(request, reply) {
  try {
    const apiKey = process.env.apiKey;
    const secret = process.env.secret;
    const { fiatAccount, ifsc, bankName, accountName } = request.body;
    // if (!request.user.isKycCompleted) {
    //     return reply.status(500).send(responseMappingError(500, "Please complete your kyc"))
    // }
    const fiat_account_exist = await FiatAccount.findOne({
      where: { fiatAccount: fiatAccount },
    });
    if (
      fiat_account_exist &&
      request.user.id === fiat_account_exist.user_id &&
      fiat_account_exist.delete === false
    ) {
      return reply
        .status(500)
        .send(
          responseMappingError(500, "You already have a fiat account with this")
        );
    }
    if (
      fiat_account_exist &&
      request.user.id === fiat_account_exist.user_id &&
      fiat_account_exist.delete === true
    ) {
      fiat_account_exist.delete = false;
      await fiat_account_exist.save();
      return reply
        .status(200)
        .send(responseMappingWithData(200, "success", "success"));
    }
    if (fiat_account_exist && fiat_account_exist.delete === false) {
      return reply
        .status(500)
        .send(responseMappingError(500, "This account already in use"));
    }
    if (fiat_account_exist && fiat_account_exist.delete === true) {
      fiat_account_exist.delete = false;
      fiat_account_exist.user_id = request.user.id;
      await fiat_account_exist.save();
      return reply
        .status(200)
        .send(responseMappingWithData(200, "success", "success"));
    }

    const create_fiat_account = {
      user_id: request.user.id,
      fiatAccountId: generateRandomFiatId(),
      fiatAccount: fiatAccount,
      ifsc: ifsc,
      bank_name: bankName,
      account_name: accountName,
    };

    await createNewRecord(FiatAccount, create_fiat_account);

    return reply
      .status(200)
      .send(responseMappingWithData(200, "success", "success"));
  } catch (error) {
    return reply.status(500).send(responseMappingError(500, error.message));
  }
}

export async function deleteAccount(request, reply) {
  try {
    const { id } = request.params;

    const account = await FiatAccount.findOne({ where: { id: id } });

    if (account.user_id !== request.user.id) {
      return reply
        .status(403)
        .send(responseMappingError(403, "Not your account"));
    }

    if (!account) {
      return reply.status(404).send(responseMappingError(500, error.message));
    }

    account.delete = true;
    await account.save();

    return reply
      .status(200)
      .send(responseMappingWithData(200, "success", "success"));
  } catch (error) {
    return reply.status(500).send(responseMappingError(500, error.message));
  }
}

export async function getAllFiatAccount(request, reply) {
  try {
    const { limit, skip } = request.query;
    const obj = {
      where: {
        user_id: request.user.id,
        delete: false,
      },
      limit: limit,
      offset: skip,
      order: [["createdAt", "DESC"]],
    };
    const all_fiat_account = await findAllRecord(FiatAccount, obj);
    return reply
      .status(200)
      .send(responseMappingWithData(200, "success", all_fiat_account));
  } catch (error) {
    console.log("this is error", error.message);
    return reply
      .status(500)
      .send(responseMappingError(500, `Internal server error`));
  }
}

export async function offRampRequest(request, reply) {
  try {
    const apiKey = process.env.apiKey;
    const secret = process.env.secret;

    const {
      fromCurrency,
      toCurrency,
      chain,
      fiatAccountId,
      fromAmount,
      toAmount,
      rate,
    } = request.body;

    if (!request.user.isKycCompleted) {
      return reply
        .status(500)
        .send(responseMappingError(500, "Please complete your kyc"));
    }

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
      rate: rate,
    };
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
      "https://api.onramp.money/onramp/api/v2/whiteLabel/offramp/createTransaction";
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      // Handle HTTP errors, e.g., 404, 500, etc.
      const errResponse = await response.json();
      console.log("data check", errResponse);

      throw new Error(errResponse.error);
    }
    const data = await response.json();
    console.log("data check", data);

    (body.user_id = request.user.id),
      (body.reference_id = data.data.transactionId);

    const transaction = await OffRampTransaction.create(body);
    let dataCrypto = {
      ...data?.data,
      cryptoNotes: [
        {
          type: -1,
          msg: "Transfers via bank accounts are not allowed for this wallet.",
        },
        {
          type: 1,
          msg: "Please transfer funds to the wallet address listed above.",
        },
        {
          type: 1,
          msg: "Cryptocurrency transfers like Bitcoin and Ethereum are accepted.",
        },
        {
          type: -1,
          msg: "Transfers via credit or debit cards are not supported for this wallet.",
        },
      ],
    };
    return reply
      .status(200)
      .send(responseMappingWithData(200, "success", dataCrypto));
  } catch (error) {
    console.log("this is error", error);
    return reply
      .status(500)
      .send(responseMappingError(500, `internal server error`));
  }
}

export async function getAllOffRamp(request, reply) {
  try {
    const { limit = 10, skip = 0 } = request.query;
    const all_off_ramp = await OffRampTransaction.findAll({
      where: {
        user_id: request.user.id,
      },
      limit: limit,
      offset: skip,
      attributes: { exclude: ["time"] }, // Exclude 'time' property from the response
      // order: [["date", "DESC"]], // Use 'date' if needed for sorting

      order: [["date", "DESC"]],
    });

    let updatedOffRamp = [];
    if (all_off_ramp?.length > 0) {
      updatedOffRamp = await Promise.all(
        all_off_ramp.map(async (item) => {
          const fiatAccount = await findRecord(FiatAccount, {
            fiatAccountId: item.fiatAccountId,
          });
          console.log(fiatAccount);
          
          const fiatDescriptionMapper = {
            SUCCESS: `Fiat money transferred successfully to ${fiatAccount?.fiatAccount}`,
            PENDING: `Fiat money transfer pending to ${fiatAccount?.fiatAccount}`,
            FAILED: `Fiat money transfer failed to ${fiatAccount?.fiatAccount}`,
          };
    
          const cryptoDescriptionMapper = {
            SUCCESS: `Crypto received successfully to ${item?.depositAddress}`,
            PENDING: `Crypto receive pending to ${item?.depositAddress}`,
            FAILED: `Crypto receive failed to ${item?.depositAddress}`,
          };
    
          return {
            ...item.dataValues,
            FiatMoneyTransferStatus: fiatDescriptionMapper[item.status],
            cryptoTransferStatus: cryptoDescriptionMapper[item.txStatus],
          };
        })
      );
    }
    
  

    return reply
      .status(200)
      .send(responseMappingWithData(200, "Success", updatedOffRamp));
  } catch (error) {
    console.log("user.controller.getQUotes", error.message);
    return reply
      .status(500)
      .send(responseMapping(500, `Internal server error`));
  }
}

export async function getQuotes(request, reply) {
  try {
    const { fromCurrency, toCurrency, fromAmount, chain } = request.body;
    const apiKey = process.env.apiKey;
    const secret = process.env.secret;
    if (fromAmount < 10) {
      return reply
        .status(500)
        .send(
          responseMappingError(
            400,
            `Amount should be greater than or equal to 10`
          )
        );
    }
    const body = {
      fromCurrency: fromCurrency,
      toCurrency: toCurrency,
      fromAmount: fromAmount,
      chain: chain,
      // paymentMethodType: paymentMethodType
    };
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

    const cachedData = await request.server.redis.get(
      `${fromCurrency}-${toCurrency}-${fromAmount}-${chain}-offramp`
    );

    if (cachedData) {
      let data_cache = await JSON.parse(cachedData);
      console.log(data_cache);
      if (data_cache.data) {
        let updatedData = data_cache.data;
        updatedData.feeInUsdt = (
          Number(data_cache?.data?.fees[0]?.tdsFee) /
          Number(data_cache?.data?.rate)
        ).toFixed(2);
        return reply
          .status(200)
          .send(responseMappingWithData(200, "success", updatedData));
      }
    }

    const url =
      "https://api.onramp.money/onramp/api/v2/whiteLabel/offramp/quote";

    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      // Handle HTTP errors, e.g., 404, 500, etc.
      console.log(await response.json());
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    let data = await response.json();
    const enter = await request.server.redis.set(
      `${fromCurrency}-${toCurrency}-${fromAmount}-${chain}-offramp`,
      JSON.stringify(data),
      "EX",
      7200
    );

    console.log(data);
    console.log(data?.data?.fees, data?.data?.rate);
    if (data.data) {
      let updatedData = data.data;
      updatedData.feeInUsdt = (
        Number(data?.data?.fees[0]?.tdsFee) / Number(data?.data?.rate)
      ).toFixed(2);
      return reply
        .status(200)
        .send(responseMappingWithData(200, "success", updatedData));
    } else {
      return reply.status(200).send(responseMappingWithData(200, "success", 0));
    }
  } catch (error) {
    logger.error("user.controller.getQuotes", error.message);
    console.log("user.controller.getQUotes", error.message);
    return reply
      .status(500)
      .send(responseMappingError(500, `${error.message}`));
  }
}

export async function createTronWallet() {
  const tronWeb = new TronWeb({
    fullHost: "https://nile.trongrid.io", // Use https://nile.trongrid.io for testnet
  });

  // Generate a new random Tron wallet
  const wallet = tronWeb.createAccount();

  wallet
    .then((account) => {
      console.log("Address:", account.address.base58);
      console.log("Private Key:", account.privateKey);
    })
    .catch((error) => {
      console.error("Error creating Tron wallet:", error);
    });
}

// Pre-generate the transaction (do not broadcast it yet)
async function preGenerateTransaction(toAddress, amount) {
  try {
    // Create an unsigned transaction (not broadcasted yet)
    const transaction = await tronWeb.transactionBuilder.sendTrx(
      toAddress,
      amount,
      tronWeb.defaultAddress.base58
    );

    // Get the transaction hash (txID) before signing
    const txHash = transaction.txID; // Transaction hash without signing
    console.log("Pre-generated txHash:", txHash);

    return { transaction, txHash };
  } catch (error) {
    console.error("Error pre-generating transaction:", error);
    throw error;
  }
}

async function generateQRCode(walletAddress) {
  try {
    const amountInTrx = 10; // Example: 10 TRX
    const amountInSun = amountInTrx * 1000000; // Convert TRX to SUN

    // Tron URI format (only wallet address as discussed earlier)
    const tronUri = `${walletAddress}`;

    // Generate the QR code with async/await
    const qrCodeUrl = await QRCode.toDataURL(tronUri, {
      errorCorrectionLevel: "L",
    });

    // Return the QR code URL
    //console.log('QR Code Data URL:', qrCodeUrl);
    return qrCodeUrl;
  } catch (err) {
    console.error("Error generating QR code:", err);
    return null; // Return null in case of an error
  }
}
export async function generateTransaction(request, reply) {
  // const transactionHash = await preGenerateTransaction("TN7Nh9nNHW9he4mP7FXwEcDM6jMeY7i3vp",10)
  // console.log(transactionHash)
  const {
    fromCurrency,
    toCurrency,
    chain,
    fiatAccountId,
    fromAmount,
    toAmount,
    rate,
  } = request.body;

  if (!request.user) {
    return reply.status(500).send(responseMappingError(500, "Invalid request"));
  }
  const tronQrCode = await generateQRCode(walletAddress);

  try {
    //console.log('QR Code Data:', tronQrCode);
    const transactionId = generateTransactionId();
    let body = {
      fromCurrency: fromCurrency,
      toCurrency: toCurrency,
      chain: chain,
      fiatAccountId: fiatAccountId,
      fromAmount: fromAmount,
      toAmount: toAmount,
      reference_id: `${transactionId}`,
      customerId: request.user.customerId,
      rate: rate,
      status: "PENDING",
      processed: "PENDING",
      depositAddress:walletAddress,
    };

    body.user_id = request.user.id;

    const transaction = await OffRampTransaction.create(body);
    if (transaction) {
      let dataCrypto = {
        reference_id: transactionId,
        wallet: walletAddress,
        qrCode: tronQrCode,
        fromCurrency,
        toCurrency,
        chain,
        fromAmount,
        cryptoNotes: [
          {
            type: -1,
            msg: "Transfers via bank accounts are not allowed for this wallet.",
          },
          {
            type: 1,
            msg: "Please transfer funds to the wallet address listed above.",
          },
          {
            type: 1,
            msg: "Cryptocurrency transfers using tron is accepted.",
          },
          {
            type: -1,
            msg: "Transfers via credit or debit cards are not supported for this wallet.",
          },
        ],
      };

      return reply
        .status(200)
        .send(responseMappingWithData(200, "success", dataCrypto));
    } else {
    }
    // Send this data to the frontend to display the QR code, or save it as an image file
  } catch (error) {
    console.error("Error generating QR code:", error);
  }
}

export async function verifyTransaction(request, reply) {
  try {
    const {
      fromCurrency,
      toCurrency,
      chain,
      fromAmount,
      reference_id,
      txHash,
    } = request.body;
    // const expectedTrxAmount = 10
    //console.log(txHash)
    // Fetch the transaction info from Tron blockchain using the txHash
    const transaction = await findRecord(OffRampTransaction, {
      // txHash: txHash,
      reference_id: reference_id.toString(),
    });

    const payoutTx = await findRecord(Payout, {
      reference_id: reference_id.toString(),
    });
    const payoutHash = await findRecord(Payout, {
      txHash: txHash,
    });
    console.log(transaction);
    console.log(payoutTx.transaction_id);
    if (transaction.length == 0) {
      return reply
        .status(400)
        .send(
          responseMappingError(400, `transaction doesnt belong to our system`)
        );
    }
    if (transaction.fromAmount !== fromAmount) {
      return reply
        .status(400)
        .send(responseMappingError(400, `invalid amount`));
    }
    if (payoutHash.transaction_id) {
      return reply
        .status(400)
        .send(
          responseMappingError(400, `transaction has already been processed`)
        );
    }
    if (transaction.txHash && transaction.txHash !== txHash) {
      return reply
        .status(400)
        .send(
          responseMappingError(
            400,
            `transaction has already been processed with different hash`
          )
        );
    }

    if (
      transaction.txStatus == "success" &&
      transaction.user_id == request.user.id &&
      payoutTx.transaction_id
    ) {
      console.log("transaction has already been processed");
      return reply
        .status(400)
        .send(
          responseMappingError(400, `transaction has already been processed`)
        );
    }
    if (transaction && transaction.user_id !== request.user.id) {
      console.log("Transaction belongs to another user");
      return reply
        .status(400)
        .send(responseMappingError(400, `Transaction belongs to another user`));
    }

    const transactionInfo = await tronWeb.trx.getTransaction(txHash);
    console.log(transactionInfo);
    if (transactionInfo) {
      const actualAmount =
        transactionInfo.raw_data.contract[0].parameter.value.amount;

      // Convert the expected amount from TRX to SUN (1 TRX = 1,000,000 SUN)
      const expectedAmountInSun = fromAmount * 1000000;
      if (expectedAmountInSun !== actualAmount) {
        return reply
          .status(400)
          .send(responseMappingError(400, `invalid amount`));
      }
      // Check if the transaction was successful
      const transactionStatus = transactionInfo.ret[0].contractRet;
      const rawData = transactionInfo.raw_data;
      let recipientAddress;
      // Check if there are any contract calls
      if (rawData && rawData.contract && rawData.contract.length > 0) {
        // Assuming the transaction is a transfer, find the contract type 'TransferContract'
        const transferContract = rawData.contract.find(
          (contract) => contract.type === "TransferContract"
        );

        if (transferContract) {
          // Get the parameter containing the recipient address
          const recipientAddressHex =
            transferContract.parameter.value.to_address;

          // Convert the hex address to a base58 (TRON) address
          recipientAddress = tronWeb.address.fromHex(recipientAddressHex);
        } else {
          console.log("No TransferContract found in transaction.");
        }
      } else {
        console.log("Invalid transaction data.");
      }
      console.log(recipientAddress);
      // Verify that the amount matches the expected value in SUN and the transaction was successful
      if (
        actualAmount === expectedAmountInSun &&
        transactionStatus === "SUCCESS" &&
        recipientAddress == walletAddress
      ) {
        console.log(
          "Transaction is valid, amount matches, and the transaction was successful."
        );
        let updateDetails = {
          txHash: transactionInfo.txID,
          txStatus: "SUCCESS",
          processed: "PENDING",
        };
        let query = {
          reference_id: reference_id.toString(),
        };

        const transaction = await findOneAndUpdate(
          OffRampTransaction,
          query,
          updateDetails
        );
        if (transaction) {
          
          const response = await generateToken();
          if (response.responseData.token) {
            const fiatAccount = await findRecord(FiatAccount, {
              fiatAccountId: transaction.fiatAccountId,
            });
            console.log(fiatAccount);
            console.log("token", response.responseData.token);
            console.log(request.user);
            const phone = request.user.phone.replace("+91-", "");
            // let body = {
            //   name: fiatAccount.account_name,
            //   email: request.user.email,
            //   phone: phone,
            //   amount: transaction.fromAmount,
            //   account_number: fiatAccount.fiatAccount,
            //   ifsc: fiatAccount.ifsc,
            //   bank_name: fiatAccount.ifsc,
            //   method: "IMPS",
            //   customer_id: request.user.customerId,
            // };
           let body = {
              "emailId": "test@payhub",
              "amount": transaction.fromAmount,
              "customer_name": "tushant",
              "customer_email": request.user.email,
              "customer_phone": phone,
              "account_number": fiatAccount.fiatAccount,
              "customer_upiId":"success@upi",
              "bank_ifsc":  fiatAccount.ifsc,
              "account_name": fiatAccount.account_name,
              "bank_name": fiatAccount.bank_name,
              "customer_address":"xyz",
              "method":"bank",
              "transaction_id":reference_id.toString()
          }
            //console.log(body);
            // const payoutRequest = await createPayoutBankRequest(
            //   response.token,
            //   body
            // );

            const payoutRequest = await createPayoutBankRequestPayhub(
              response.responseData,
              body
            );
            console.log(payoutRequest);
            if (
              payoutRequest.responseCode == 200 &&
              payoutRequest.responseData.transaction_id
            ) {
              let updatedData ={
              name: fiatAccount.account_name,
              email: request.user.email,
              phone: phone,
              amount: transaction.fromAmount,
              account_number: fiatAccount.fiatAccount,
              ifsc: fiatAccount.ifsc,
              bank_name: fiatAccount.bank_name,
              method: "IMPS",
              customer_id: request.user.customerId,
              }
              updatedData.transaction_id =
                payoutRequest.responseData.transaction_id.toString();
                updatedData.reference_id = reference_id.toString();
                updatedData.user_id = request.user.id;
                updatedData.txHash = txHash;
              const payoutsData = await createNewRecord(Payout, updatedData);
              transaction.payout_id =
                payoutRequest.responseData.transaction_id.toString();
              transaction.save();
              console.log(payoutsData);
              return reply
                .status(200)
                .send(
                  responseMappingWithData(
                    200,
                    "success",
                    payoutRequest.responseData
                  )
                );
            } else {
              return reply
                .status(500)
                .send(responseMappingError(500, `Internal server error`));
            }
          }
          // console.log(transaction)
        } else {
          console.log("transaction doesnt belong to our system");
          return reply
          .status(400)
          .send(responseMappingError(500, `transaction doesnt belong to our system`));
        }
        //const transaction = await OffRampTransaction.create(body)
        // Mark payment as successful in your system
      } else if (actualAmount !== expectedAmountInSun) {
        console.log("Transaction amount does not match the expected value.");
        return reply
        .status(400)
        .send(responseMappingError(500, `Transaction amount does not match the expected value.`));
      } else if (transactionStatus !== "SUCCESS") {
        console.log("Transaction was not successful.");
        return reply
        .status(400)
        .send(responseMappingError(500, `Transaction was not successful`));
      }
    } else {
      console.log("Transaction not found.");
      return reply
        .status(400)
        .send(responseMappingError(404, `Transaction not found.`));
    }
  } catch (error) {
    console.error("Error verifying transaction:", error);
    return reply
        .status(500)
        .send(responseMappingError(404, `Internal Server Error.`));
  }
}

export async function getQuotesNew(request, reply) {
  try {
    const { fromCurrency, toCurrency, fromAmount, chain } = request.body;
    let query = {
      id: 1,
    };
    const usdt = await findRecord(Usdt, query);
    const apiKey = process.env.apiKey;
    const secret = process.env.secret;
    if (fromAmount < 10) {
      return reply
        .status(500)
        .send(
          responseMappingError(
            400,
            `Amount should be greater than or equal to 10`
          )
        );
    }
    const body = {
      fromCurrency: fromCurrency,
      toCurrency: toCurrency,
      fromAmount: fromAmount,
      chain: chain,
      // paymentMethodType: paymentMethodType
    };
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
    // const timestamp = Date.now().toString();
    // const obj = {
    //   body,
    //   timestamp,
    // };

    // // Create the payload and signature
    // const payload = cryptoJs.enc.Base64.stringify(
    //   cryptoJs.enc.Utf8.parse(JSON.stringify(obj))
    // );
    // const signature = cryptoJs.enc.Hex.stringify(
    //   cryptoJs.HmacSHA512(payload, secret)
    // );

    // // Create the headers
    // const headers = {
    //   "Content-Type": "application/json",
    //   apiKey: apiKey,
    //   payload: payload,
    //   signature: signature,
    // };

    const cachedData = await request.server.redis.get(
      `${fromCurrency}-${toCurrency}-${fromAmount}-${chain}-offramp`
    );
    const usdtRate = usdt.inrRateOfframp; // constant exchange rate
    let onrampFeePercentage, gatewayFeePercentage, tdsFeePercentage;

    // Conditional percentages based on fromAmount
    if (fromAmount === 10) {
      onrampFeePercentage = 0.3;
      gatewayFeePercentage = 0.96;
      tdsFeePercentage = 1.003;
    } else if (fromAmount > 10) {
      onrampFeePercentage = 0.272;
      gatewayFeePercentage = 0.943;
      tdsFeePercentage = 0.988;
    } else {
      // Set default values if needed
      onrampFeePercentage = 0.3;
      gatewayFeePercentage = 0.96;
      tdsFeePercentage = 1.003;
    }

    // Calculate fees
    const onrampFee = fromAmount * (onrampFeePercentage / 100) * usdtRate;
    const gatewayFee = fromAmount * (gatewayFeePercentage / 100) * usdtRate;
    const tdsFee = fromAmount * (tdsFeePercentage / 100) * usdtRate;

    // Calculate final amount after fees
    const toAmountOfframp =
      fromAmount * usdtRate - (onrampFee + gatewayFee + tdsFee);

    // // Log results
    // console.log("Total Fees:", onrampFee + gatewayFee + tdsFee);
    // console.log("Converted Amount:", fromAmount * usdtRate);
    // console.log("Fees Breakdown:", { onrampFee, gatewayFee, tdsFee });
    console.log("Final Amount:", toAmountOfframp);
    const offrampAmount ={
      status: 1,
      code: 200,
      data: {
        fromCurrency: 'usdt',
        toCurrency: 'INR',
        fromAmount: '100',
        toAmount: toAmountOfframp.toFixed(2),
        rate: usdtRate,
        fees:[
          {
            type: 'fiat',
            onrampFee: onrampFee.toFixed(2),
            gatewayFee: gatewayFee.toFixed(2),
            tdsFee: tdsFee.toFixed(2)
          }
        ]
      }
    }
    console.log(offrampAmount)
    // if (cachedData) {
    //   let data_cache = await JSON.parse(cachedData);
    //   //console.log(data_cache);
    //   if (data_cache.data) {
    //     let updatedData = data_cache.data;
    //     updatedData.feeInUsdt = (
    //       Number(data_cache?.data?.fees[0]?.tdsFee) /
    //       Number(data_cache?.data?.rate)
    //     ).toFixed(2);
    //     return reply
    //       .status(200)
    //       .send(responseMappingWithData(200, "success", updatedData));
    //   }
    // }

    // const url =
    //   "https://api.onramp.money/onramp/api/v2/whiteLabel/offramp/quote";

    // const response = await fetch(url, {
    //   method: "POST",
    //   headers: headers,
    //   body: JSON.stringify(body),
    // });

    // if (!response.ok) {
    //   // Handle HTTP errors, e.g., 404, 500, etc.
    //   console.log(await response.json());
    //   throw new Error(`HTTP error! Status: ${response.status}`);
    // }

    // let data = await response.json();

    const enter = await request.server.redis.set(
      `${fromCurrency}-${toCurrency}-${fromAmount}-${chain}-offramp`,
      JSON.stringify(offrampAmount),
      "EX",
      7200
    );

    // console.log(data);
    // console.log(data?.data?.fees, data?.data?.rate);
    if (offrampAmount?.data) {
      let updatedData = offrampAmount.data;
      updatedData.feeInUsdt = (
        Number(offrampAmount?.data?.fees[0]?.tdsFee) / Number(offrampAmount?.data?.rate)
      ).toFixed(2);
      console.log(updatedData)
      return reply
        .status(200)
        .send(responseMappingWithData(200, "success", updatedData));
    } else {
      return reply.status(200).send(responseMappingWithData(200, "success", 0));
    }
  } catch (error) {
    logger.error("user.controller.getQuotes", error.message);
    console.log("user.controller.getQUotes", error.message);
    return reply
      .status(500)
      .send(responseMappingError(500, `${error.message}`));
  }
}