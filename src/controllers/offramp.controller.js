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
  findRecordNew,
  getFee,
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
import { generateRandomFiatId, generateTransactionId, validateBankAccount } from "../utils/utils.js";
// import {
//   createPayoutBankRequest,
//   generateToken,
// } from "../ApiCalls/globalpay.js";
import {
  getRecipientAddress,
  getRecipientAddressUsingTronscan,
  tronWeb,
  walletAddress,
} from "../utils/tronUtils.js";
import {
  createPayoutBankRequestPayhub,
  generateToken,
} from "../ApiCalls/payhub.js";
import { createInstantPayoutBankRequest } from "../gateways/kwikpaisa.js";
import { sendFundTransferRequest } from "../gateways/gennpayPayout.js";
import { createRazorpayPayoutService } from "../gateways/razorpay.js";
import { Op } from "sequelize";
import {enqueueCallback} from "../utils/sqs/producer"

const {
  User,
  Coin,
  OnRampTransaction,
  OffRampTransaction,
  FiatAccount,
  Payout,
  Usdt,
  ValidatedAccounts,
  OffRampLiveTransactions
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
        .status(400)
        .send(
          responseMappingError(400, "You already have a fiat account with this")
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
        .status(400)
        .send(responseMappingError(400, "This account already in use"));
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

export async function validateFiatAccount(request, reply) {
  try {
    
    const { fiatAccount, ifsc} = request.body;
    // if (!request.user.isKycCompleted) {
    //     return reply.status(500).send(responseMappingError(500, "Please complete your kyc"))
    // }
    const fiat_account_exist = await FiatAccount.findOne({
      where: { fiatAccount: fiatAccount },
    });
    if (
      fiat_account_exist &&
      request.user.id !== fiat_account_exist.user_id 
    ) {
      return reply
        .status(400)
        .send(
          responseMappingError(400, "Account belongs to someone else")
        );
    }
    // if (
    //   fiat_account_exist &&
    //   request.user.id === fiat_account_exist.user_id &&
    //   fiat_account_exist.delete === true
    // ) {
     
    //   return reply
    //     .status(200)
    //     .send(responseMappingError(400,"Account already added"));
    // }
    
    if (fiat_account_exist && fiat_account_exist.delete === false) {
      return reply
        .status(500)
        .send(responseMappingError(400, "This account already in use"));
    }
    const Validated_Accounts = await ValidatedAccounts.findOne({
      where: { fiatAccount: fiatAccount },
    });
    if(Validated_Accounts)
    {
      return reply
      .status(200)
      .send(responseMappingWithData(200, "success", "Valid bank account"));
    }
    const validate = await validateBankAccount(fiatAccount,ifsc)
    if(validate?.data?.status=='success')
    {
      const create_validated_accounts = {
        fiatAccount: fiatAccount,
        ifsc: ifsc,
      };
  
      await createNewRecord(ValidatedAccounts, create_validated_accounts);
      return reply
      .status(200)
      .send(responseMappingWithData(200, "success", "Valid bank account"));
    }
    else if(validate?.data?.status=='failure')
    {
      return reply
      .status(200)
      .send(responseMappingError(400,validate?.data?.message));
    }else{
      return reply
      .status(500)
      .send(responseMappingError(500, "Internal server error"));
    }
  } catch (error) {
    return reply.status(500).send(responseMappingError(500, error.message));
  }
}

export async function AddFiatAccountOfframp(request, reply) {
  try {
  
    const { fiatAccount, ifsc, bankName, accountName } = request.body;
    // if (!request.user.isKycCompleted) {
    //     return reply.status(500).send(responseMappingError(500, "Please complete your kyc"))
    // }
    const fiat_account_exist = await FiatAccount.findOne({
      where: { fiatAccount: fiatAccount },
    });
    if (
      fiat_account_exist &&
      request.user.id !== fiat_account_exist.user_id 
    ) {
      return reply
        .status(400)
        .send(
          responseMappingError(400, "Account belongs to someone else")
        );
    }
    // if (
    //   fiat_account_exist &&
    //   request.user.id === fiat_account_exist.user_id &&
    //   fiat_account_exist.delete === false
    // ) {
     
    //   return reply
    //     .status(200)
    //     .send(responseMappingError(400,"Account already added"));
    // }
    
    if (fiat_account_exist && fiat_account_exist.delete === false) {
      return reply
        .status(400)
        .send(responseMappingError(400, "This account already in use"));
    }
    const Validated_Accounts = await ValidatedAccounts.findOne({
      where: { fiatAccount: fiatAccount },
    });

    const validate = await validateBankAccount(fiatAccount,ifsc)
    //console.log('validate', validate)
    if(validate?.data?.status=='success'||Validated_Accounts)
    {
      const create_validated_accounts = {
        fiatAccount: fiatAccount,
        ifsc: ifsc,
      };
  
      await createNewRecord(ValidatedAccounts, create_validated_accounts);
      const fiat_account_exist = await FiatAccount.findOne({
        where: { fiatAccount: fiatAccount },
      });
      if (
        fiat_account_exist &&
        request.user.id !== fiat_account_exist.user_id 
      ) {
        return reply
          .status(400)
          .send(
            responseMappingError(400, "Account belongs to someone else")
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
          .send(responseMappingWithData(200, "success", "Bank added successfully"));
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
          .send(responseMappingError(400, "This account already in use"));
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
      // return reply
      // .status(200)
      // .send(responseMappingWithData(200, "success", "Valid bank account"));
    }
    else if(validate?.data?.status=='failure')
    {
      return reply
      .status(400)
      .send(responseMappingError(400,validate?.data?.message));
    }else{
      return reply
      .status(500)
      .send(responseMappingError(500, "Internal server error"));
    }
    // if (!request.user.isKycCompleted) {
    //     return reply.status(500).send(responseMappingError(500, "Please complete your kyc"))
    // }
   
  } catch (error) {
    console.log("error add fiat account",error)
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

const banksInIndia = [
  { name: "Allahabad Bank", shortName: "AB", imageUrl: "https://images.app.goo.gl/SEWemD5kYdk7t6Zb9" },
  { name: "Punjab National Bank", shortName: "PNB", imageUrl: "https://via.placeholder.com/150" },
  { name: "HDFC Bank Ltd", shortName: "HDFC", imageUrl: "https://via.placeholder.com/150" },
  { name: "ICICI Bank Ltd", shortName: "ICICI", imageUrl: "https://via.placeholder.com/150" },
  { name: "Kotak Mahindra Bank Ltd", shortName: "Kotak", imageUrl: "https://via.placeholder.com/150" },
  { name: "Andhra Pradesh Grameena Vikas Bank", shortName: "APGVB", imageUrl: "https://via.placeholder.com/150" },
  { name: "Punjab Gramin Bank", shortName: "PGB", imageUrl: "https://via.placeholder.com/150" },
  { name: "HSBC Ltd", shortName: "HSBC", imageUrl: "https://via.placeholder.com/150" },
  { name: "Citibank N.A.", shortName: "Citibank", imageUrl: "https://via.placeholder.com/150" },
  { name: "Barclays Bank Plc.", shortName: "Barclays", imageUrl: "https://via.placeholder.com/150" },
  { name: "Andhra Bank", shortName: "Andhra Bank", imageUrl: "https://via.placeholder.com/150" },
  { name: "Axis Bank", shortName: "Axis", imageUrl: "https://via.placeholder.com/150" },
  { name: "Bank of Bahrain and Kuwait", shortName: "BBK", imageUrl: "https://via.placeholder.com/150" },
  { name: "Bank of Baroda - Corporate Banking", shortName: "BoB CB", imageUrl: "https://via.placeholder.com/150" },
  { name: "Bank of Baroda - Retail Banking", shortName: "BoB RB", imageUrl: "https://via.placeholder.com/150" },
  { name: "Bank of India", shortName: "BOI", imageUrl: "https://via.placeholder.com/150" },
  { name: "Bank of Maharashtra", shortName: "BoM", imageUrl: "https://via.placeholder.com/150" },
  { name: "Canara Bank", shortName: "Canara", imageUrl: "https://via.placeholder.com/150" },
  { name: "Central Bank of India", shortName: "CBI", imageUrl: "https://images.app.goo.gl/FxA4uTUqw1FRgBDLA" },
  { name: "HDFC Bank Ltd", shortName: "HDFC", imageUrl: "https://images.app.goo.gl/HyDrWoiQvMAMfDqV7" },
  { name: "City Union Bank", shortName: "CUB", imageUrl: "https://images.app.goo.gl/5HMBeojmcxeqyrD59" },
  { name: "Corporation Bank", shortName: "Corporation Bank", imageUrl: "https://images.app.goo.gl/VbH62JACC2Ww7GVD6" },
  { name: "Deutsche Bank", shortName: "Deutsche", imageUrl: "https://images.app.goo.gl/E39eni3GV7mMFMSQ7" },
  { name: "Development Credit Bank", shortName: "DCB", imageUrl: "https://images.app.goo.gl/tp96cprNw4vLZ3L56" },
  { name: "Dhanlaxmi Bank", shortName: "Dhanlaxmi", imageUrl: "https://images.seeklogo.com/logo-png/31/1/dhanlaxmi-bank-logo-png_seeklogo-311132.png?v=1956420846047062880" },
  { name: "Federal Bank", shortName: "Federal Bank", imageUrl: "https://images.app.goo.gl/RAgQ42X3jPWCX23M6" },
  { name: "ICICI Bank", shortName: "ICICI", imageUrl: "https://images.app.goo.gl/rQua63rfD2S62Vqf6" },
  { name: "IDBI Bank", shortName: "IDBI", imageUrl: "https://images.app.goo.gl/Wu8GoDYhcVuaDM2A6" },
  { name: "Indian Bank", shortName: "Indian Bank", imageUrl: "https://images.app.goo.gl/ZB4ggm4ctoPbN6wZ9" },
  { name: "Indian Overseas Bank", shortName: "IOB", imageUrl: "https://images.app.goo.gl/ZEEi7C1Dgm6MQ2b46" },
  { name: "IndusInd Bank", shortName: "IndusInd", imageUrl: "https://images.app.goo.gl/amGRtyF65ubnPgNa7" },
  { name: "ING Vysya Bank", shortName: "ING", imageUrl: "https://images.app.goo.gl/5h9MQFoJRAJyHiw76" },
  { name: "Jammu and Kashmir Bank", shortName: "J&K Bank", imageUrl: "https://images.app.goo.gl/LEHP6b7ttf7zfBSMA" },
  { name: "Karnataka Bank Ltd", shortName: "Karnataka Bank", imageUrl: "https://images.app.goo.gl/3cKwLMe9P2R1eCqH7" },
  { name: "Karur Vysya Bank", shortName: "KVB", imageUrl: "https://images.app.goo.gl/GyJdsMD76s9TKS4eA" },
  { name: "Kotak Bank", shortName: "Kotak", imageUrl: "https://images.app.goo.gl/AXuhUeXdMae6UfkW8" },
  { name: "Laxmi Vilas Bank", shortName: "LVB", imageUrl: "https://images.app.goo.gl/JBBmbPG6vfrnB5gC9" },
  { name: "Oriental Bank of Commerce", shortName: "OBC", imageUrl: "https://images.app.goo.gl/1ETVv9S37EHRYJCY6" },
  { name: "Punjab National Bank - Corporate Banking", shortName: "PNB CB", imageUrl: "https://images.app.goo.gl/bBt6dPGQMZrNQ4vw9" },
  { name: "Punjab National Bank - Retail Banking", shortName: "PNB RB", imageUrl: "https://images.app.goo.gl/bBt6dPGQMZrNQ4vw9" },
  { name: "Punjab & Sind Bank", shortName: "PSB", imageUrl: "https://images.app.goo.gl/WXoUyB6efvMyeC556" },
  { name: "Shamrao Vithal Co-operative Bank", shortName: "SVC Bank", imageUrl: "https://images.app.goo.gl/4TAcsoaDz4BHxNRz5" },
  { name: "South Indian Bank", shortName: "SIB", imageUrl: "https://images.app.goo.gl/ZhSGuowi5wD5CW169" },
  { name: "State Bank of Bikaner & Jaipur", shortName: "SBBJ", imageUrl: "https://images.app.goo.gl/JUmP6joZCDQsf2mY8" },
  { name: "State Bank of Hyderabad", shortName: "SBH", imageUrl: "https://images.app.goo.gl/Lb5nYiMTTk4pDAFc6" },
  { name: "State Bank of India", shortName: "SBI", imageUrl: "https://images.app.goo.gl/PJcXdadFzC5opDuK6" },
  { name: "State Bank of Mysore", shortName: "SBM", imageUrl: "https://images.app.goo.gl/meQB7XeASZCjFmsi9" },
  { name: "State Bank of Patiala", shortName: "SBP", imageUrl: "https://images.app.goo.gl/jCzt2wehiaeS6pG3A" },
  // Additional banks from the user's request
];

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

    
  // Convert bankDetails into a Map for faster lookup
  const bankMap = new Map(banksInIndia.map(bank => [bank.name, bank]));
    
  // Merge the bank details into fiat accounts
  const enrichedFiatAccounts = all_fiat_account.map(account => {
      const bankInfo = bankMap.get(account.bank_name) || { imageUrl: "", shortName: "" };
  
      return {
          ...account.dataValues,
          imageUrl: bankInfo.imageUrl,
          shortName: bankInfo.shortName
      };
  });
    return reply
      .status(200)
      .send(responseMappingWithData(200, "success", enrichedFiatAccounts));
  } catch (error) {
    console.log("this is error", error.message);
    return reply
      .status(500)
      .send(responseMappingError(500, `Internal server error`));
  }
}

export async function getCountries(request, reply) {
  try {
    const countries = [
      {
        name: "India",
        dialCode: "+91",
        code: "IN",
        flag: "https://upload.wikimedia.org/wikipedia/en/4/41/Flag_of_India.svg",
      },
    ];
    return reply
      .status(200)
      .send(responseMappingWithData(200, "success", countries));
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
    userWalletAddress
  } = request.body;

  if (!request.user) {
    return reply.status(401).send(responseMappingError(401, "Invalid request"));
  }

  if (!request?.user?.isKycCompleted) {
    return reply.status(400).send(responseMappingError(400, "please complete KYC first"));
  }


  if (fromAmount < 1) {
    return reply
      .status(500)
      .send(
        responseMappingError(
          400,
          `Amount should be greater than or equal to 10`
        )
      );
  }
  const verified = await verifyQuotes(request.body);
  console.log("verify check", verified);
  const exists = await findRecordNew(OffRampLiveTransactions, {
   walletAddress:userWalletAddress
  });

  console.log("exists", exists);
  if(exists&&request.user.id!==exists.user_id)
  {
    return reply
    .status(400)
    .send(responseMappingError(400, "Wallet address belongs to someone else"));
  }

  if (!verified) {
    return reply
      .status(400)
      .send(responseMappingError(400, "Quote has changed. please try again"));
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
      depositAddress: walletAddress,
      walletAddress:userWalletAddress
    };

    body.user_id = request.user.id;

    const transaction = await OffRampTransaction.create(body);
    const liveTx = await OffRampLiveTransactions.create(body)
    if (transaction&&liveTx) {
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
      fromAmount,
      reference_id,
      txHash,
    } = request.body;
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
    console.log(payoutTx);
    if (
      transaction &&
      (transaction?.status === "PENDING" ||
        transaction?.processed == "PENDING") &&
      transaction?.txHash &&
      transaction?.payout_id
    ) {      
      return reply
      .status(400)
      .send(responseMappingError(400, 'Transaction is already under process please check status from history'));

    }
    console.log(transaction?.processed);
    if (transaction && transaction?.processed === "SUCCESS") {
      return reply
      .status(400)
      .send(responseMappingError(400, 'Transaction is already under process please check status from history'));
    }

    if (transaction.length == 0) {
      return reply
      .status(400)
      .send(responseMappingError(400, 'Transaction doesnt belong to our system'));
    }
    if (transaction.fromAmount !== fromAmount) {
      return reply
      .status(400)
      .send(responseMappingError(400, 'Invalid amount'));
    }
    if (payoutHash && payoutHash?.status === "SUCCESS") {
      return reply
      .status(400)
      .send(responseMappingError(400, 'Transaction has already been processed'));
    }
    if (payoutHash && payoutHash?.status === "PENDING") {
      return reply
      .status(400)
      .send(responseMappingError(400, 'Transaction is under process currently'));
    }

    if (transaction.txHash && transaction.txHash !== txHash) {
      return reply
      .status(400)
      .send(responseMappingError(400, 'Transaction has already been processed with different hash'));
    }

    if (
      transaction.txStatus == "success" &&
      transaction.user_id == request.user.id &&
      payoutTx.transaction_id
    ) {
      console.log("transaction has already been processed");
      return reply
      .status(400)
      .send(responseMappingError(400, 'Transaction has already been processed'));
      
    }
    if (transaction && transaction.user_id !== request.user.id) {
      console.log("Transaction belongs to another user");
      return reply
      .status(400)
      .send(responseMappingError(400, 'Transaction belongs to another user'));
    }

    const transactionInfo = await tronWeb.trx
    .getTransaction(txHash)
    .catch((error) => {
      return reply
      .status(400)
      .send(responseMappingError(404, 'Transaction not found.'));

    });
  console.log(transactionInfo);
  if (!transactionInfo || !transactionInfo.txID) {
    console.log("Transaction not found.");
    return reply
    .status(400)
    .send(responseMappingError(404, 'Transaction not found.'));

  }
  let actualAmount;

  if (transactionInfo.raw_data.contract[0].type === "TransferContract") {
    // Native TRX transfer
    console.log("contract native");
    actualAmount =
      transactionInfo.raw_data.contract[0].parameter.value.amount;
  } else if (
    transactionInfo.raw_data.contract[0].type === "TriggerSmartContract"
  ) {
    // Token transfer (e.g., USDT)
    const data = transactionInfo.raw_data.contract[0].parameter.value.data;
    console.log("contract smart");
    if (data && data.length >= 64) {
      // If the data is present directly, get the amount from the last 32 characters
      const amountHex = data.substring(data.length - 32);
      actualAmount = BigInt(`0x${amountHex}`);
    } else {
      // Fallback: If data is not directly accessible, use raw_data_hex to extract the amount
      const rawDataHex = transactionInfo.raw_data_hex;
      const amountHex = rawDataHex.substring(
        rawDataHex.length - 64,
        rawDataHex.length - 32
      );
      actualAmount = BigInt(`0x${amountHex}`);
    }
  }

  const expectedAmountInSun = fromAmount * 1000000;
  console.log(
    "check check",
    expectedAmountInSun.toString(),
    actualAmount.toString()
  );
  if (expectedAmountInSun.toString() !== actualAmount.toString()) {
    return reply.status(400).send(responseMappingError(400, "Invalid amount"));

  }

    const enqueue_data = await enqueueCallback(request.body,"verifyTransaction")
    return reply.status(200).send(responseMappingError(200, "Your verify request is under process"));
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

    if (fromAmount < 1) {
      return reply
        .status(500)
        .send(
          responseMappingError(
            400,
            `Amount should be greater than or equal to 10`
          )
        );
    }

    const cachedData = await request.server.redis.get(
      `${fromCurrency}-${toCurrency}-${fromAmount}-${chain}-offramp`
    );

    if (cachedData) {
      let data_cache = await JSON.parse(cachedData);
      //console.log(data_cache);
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

    const usdtRate = usdt.inrRateOfframp; // constant exchange rate
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
      fromAmount * usdtRate - (onrampFee + gatewayFee + tdsFee);

    // // Log results
    // console.log("Total Fees:", onrampFee + gatewayFee + tdsFee);
    // console.log("Converted Amount:", fromAmount * usdtRate);
    // console.log("Fees Breakdown:", { onrampFee, gatewayFee, tdsFee });
    console.log("Final Amount:", toAmountOfframp);
    const offrampAmount = {
      status: 1,
      code: 200,
      data: {
        fromCurrency: "usdt",
        toCurrency: "INR",
        fromAmount: fromAmount,
        toAmount: toAmountOfframp.toFixed(2),
        rate: usdtRate,
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
    console.log(offrampAmount);

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
        Number(offrampAmount?.data?.fees[0]?.tdsFee) /
        Number(offrampAmount?.data?.rate)
      ).toFixed(2);
      console.log(updatedData);
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




export async function verifyQuotes(request) {
  try {
    const { fromCurrency, toCurrency, fromAmount, chain, toAmount } = request;
    let query = {
      id: 1,
    };
    const usdt = await findRecord(Usdt, query);

    const usdtRate = usdt.inrRateOfframp; // constant exchange rate
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
      fromAmount * usdtRate - (onrampFee + gatewayFee + tdsFee);

    // // Log results
    // console.log("Total Fees:", onrampFee + gatewayFee + tdsFee);
    // console.log("Converted Amount:", fromAmount * usdtRate);
    // console.log("Fees Breakdown:", { onrampFee, gatewayFee, tdsFee });
    console.log("Final Amount:", toAmountOfframp);
    const offrampAmount = {
      status: 1,
      code: 200,
      data: {
        fromCurrency: "usdt",
        toCurrency: "INR",
        fromAmount: fromAmount,
        toAmount: toAmountOfframp.toFixed(2),
        rate: usdtRate,
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
    console.log(offrampAmount);

    // const enter = await request.server.redis.set(
    //   `${fromCurrency}-${toCurrency}-${fromAmount}-${chain}-offramp`,
    //   JSON.stringify(offrampAmount),
    //   "EX",
    //   7200
    // );

    // console.log(data);
    // console.log(data?.data?.fees, data?.data?.rate);
    if (offrampAmount?.data) {
      if (offrampAmount?.data?.toAmount == toAmount) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  } catch (error) {
    logger.error("user.controller.getQuotes", error.message);
    console.log("user.controller.getQUotes", error.message);
    return false;
  }
}


export async function offrampRetry(request, reply) {
  try {
    const {
      transactionId,
      sentFiatAccount = false,
      fiatAccountId,
      newBank = false,
      fiatAccount,
      bankName,
      ifsc,
      accountName
    } = request.body;

    console.log(request.body);
    if (!request?.user || !request?.user?.id) {
      return reply.status(401).send(responseMappingError(401, "User not authenticated"));
    }
  
    if (!request?.user?.isKycCompleted) {
      return reply.status(400).send(responseMappingError(400, "please complete KYC first"));
    }
    console.log("newbank",newBank,"sentFiatAccount", sentFiatAccount)
    console.log(newBank==true&&sentFiatAccount==true)
    if(newBank==true&&sentFiatAccount==true)
    {
      return reply.status(400).send(responseMappingError(400,"Invalid request type"));
    }
   

    const offramp = await OffRampTransaction.findOne({
      where: {
        transaction_id: transactionId
       } // Ensure it's a string if stored as UUI
    });

   

    console.log('offramp',offramp);
    console.log("user",request?.user)
 
    if(!offramp)
    {
      return reply.status(400).send(responseMappingError(400,"Transaction does not exist"));
    }
    const payoutTx = await findRecord(Payout, {
      reference_id: offramp?.reference_id.toString(),
    });

    if(!payoutTx)
      {
        return reply.status(400).send(responseMappingError(400,"Transaction does not exist"));
      }

    if (
      offramp &&
      offramp?.user_id!==request?.user?.id
    ) {
      return reply.status(400).send(responseMappingError(400,"Transaction belongs to a different user"));
    }

    if (offramp?.status=="PENDING"||offramp?.txStatus=="PENDING"||offramp?.processed=="PENDING") {
      return reply.status(400).send(responseMappingError(400,"Transaction is under process"));
    }

    if (offramp?.status=="SUCCESS"||offramp?.processed=="SUCCESS") {
      return reply.status(400).send(responseMappingError(400,"Transaction is already processed"));

    }

    if (sentFiatAccount) {
      const fiatAccountexist = await FiatAccount.findOne({
        where: {
          fiatAccountId: fiatAccountId.toString(), // Ensure proper type conversion
        },
      });
      console.log(sentFiatAccount)

      if (!fiatAccountexist) {
        return reply.status(400).send(responseMappingError(400,"Account doesn't exist"));

      }

      if (fiatAccountexist.user_id !== request?.user?.id) {
        return reply.status(400).send(responseMappingError(400, "Account doesn't belong to user"));
      }

      const transactionID = generateTransactionId();

      const payoutRequest = await sendFundTransferRequest(
        process.env.GENNPAYAPIKEY,
        transactionID.toString(),
        offramp.toAmount.toString(),
        fiatAccountexist.fiatAccount,
        fiatAccountexist.ifsc,
        "IMPS",
        {
          accountName: fiatAccountexist.account_name,
          bankName: fiatAccountexist.bank_name,
        }
      );

      payoutTx.transaction_id = payoutRequest.data.transaction_id.toString();
      payoutTx.payout_id = payoutRequest.data.transaction_id.toString();
      await payoutTx.save();
      return reply
              .status(200)
              .send(
                responseMappingWithData(200, "success", payoutRequest.data)
              );
    }

    if (newBank) {
      const fiatAccountexist = await FiatAccount.findOne({
        where: {
          fiatAccount: fiatAccount.toString(),
        },
      });
      console.log('fiat account',fiatAccountexist)

      if (fiatAccountexist) {
        return reply.status(400).send(responseMappingError(400, "Account already exists"));
      }
      const transactionID = generateTransactionId();

      const payoutRequest = await sendFundTransferRequest(
        process.env.GENNPAYAPIKEY,
        transactionID.toString(),
        offramp.toAmount.toString(),
        fiatAccount?.toString(),
        ifsc,
        "IMPS",
        {
          accountName: accountName,
          bankName: bankName,
        }
      );

      payoutTx.transaction_id = payoutRequest.data.transaction_id.toString();
      payoutTx.payout_id = payoutRequest.data.transaction_id.toString();
      await payoutTx.save();
      return reply
              .status(200)
              .send(
                responseMappingWithData(200, "success", payoutRequest.data)
              );

    }
  } catch (error) {
    console.log(error.message)

    reply.status(500).send(responseMappingError(500, `Sorry your sell request didn’t work. Please try again`));
  }
}


export async function transactionStatus(request,reply){
  try{
    const {transactionId} = request.body
    const offramp_transaction = await OffRampTransaction.findOne({
      where:{
       transaction_id: transactionId,
       user_id: request.user.id
      }
    }) 

    if(!offramp_transaction){
      return reply.status(400).send(responseMappingError(404,"Transaction does not exist"));
    }
    return reply
              .status(200)
              .send(
                responseMappingWithData(200, "success", {
                  status:offramp_transaction.status,
                  txStatus:offramp_transaction.txStatus
                })
              );

  }catch(error){
    return reply.status(500).send(responseMappingError(500,"Internal server error"));
  }
}