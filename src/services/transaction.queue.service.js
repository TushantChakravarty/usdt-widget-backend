// import { findOneAndUpdate, findRecord } from "../Dao/dao";
// import { getRecipientAddressUsingTronscan } from "../utils/tronUtils";



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

// export async function verifyTransaction(details) {
//   try {
//     const {
//       fromCurrency,
//       toCurrency,
//       chain,
//       fromAmount,
//       reference_id,
//       txHash,
//     } = details;

   

//     // const expectedTrxAmount = 10
//     //console.log(txHash)
//     // Fetch the transaction info from Tron blockchain using the txHash
//     const transaction = await findRecord(OffRampTransaction, {
//       // txHash: txHash,
//       reference_id: reference_id.toString(),
//     });

//     const payoutTx = await findRecord(Payout, {
//       reference_id: reference_id.toString(),
//     });
//     const payoutHash = await findRecord(Payout, {
//       txHash: txHash,
//     });
//     console.log(transaction);
//     console.log(payoutTx);
  
  
//     const transactionInfo = await tronWeb.trx
//       .getTransaction(txHash)
//       .catch((error) => {
//         return false
//       });
//     console.log(transactionInfo);
//     if (!transactionInfo || !transactionInfo.txID) {
//       console.log("Transaction not found.");
//       return false
//     }

//     if (transactionInfo) {
//       let actualAmount;

//       if (transactionInfo.raw_data.contract[0].type === "TransferContract") {
//         // Native TRX transfer
//         console.log("contract native");
//         actualAmount =
//           transactionInfo.raw_data.contract[0].parameter.value.amount;
//       } else if (
//         transactionInfo.raw_data.contract[0].type === "TriggerSmartContract"
//       ) {
//         // Token transfer (e.g., USDT)
//         const data = transactionInfo.raw_data.contract[0].parameter.value.data;
//         console.log("contract smart");
//         if (data && data.length >= 64) {
//           // If the data is present directly, get the amount from the last 32 characters
//           const amountHex = data.substring(data.length - 32);
//           actualAmount = BigInt(`0x${amountHex}`);
//         } else {
//           // Fallback: If data is not directly accessible, use raw_data_hex to extract the amount
//           const rawDataHex = transactionInfo.raw_data_hex;
//           const amountHex = rawDataHex.substring(
//             rawDataHex.length - 64,
//             rawDataHex.length - 32
//           );
//           actualAmount = BigInt(`0x${amountHex}`);
//         }
//       }

//       const expectedAmountInSun = fromAmount * 1000000;
//       console.log(
//         "check check",
//         expectedAmountInSun.toString(),
//         actualAmount.toString()
//       );
//       if (expectedAmountInSun.toString() !== actualAmount.toString()) {
//         return reply
//           .status(400)
//           .send(responseMappingError(400, `invalid amount`));
//       }
//       // Check if the transaction was successful
//       const transactionStatus = transactionInfo.ret[0].contractRet;
//       const rawData = transactionInfo.raw_data;
//       let recipientAddress = await getRecipientAddressUsingTronscan(txHash);
//       // Check if there are any contract calls
//       // if (rawData && rawData.contract && rawData.contract.length > 0) {
//       //   // Assuming the transaction is a transfer, find the contract type 'TransferContract'
//       //   const transferContract = rawData.contract.find(
//       //     (contract) => contract.type === "TriggerSmartContract"
//       //   );

//       //   if (transferContract) {
//       //     // Get the parameter containing the recipient address
//       //     const recipientAddressHex =
//       //       transferContract.parameter.value.to_address;

//       //     // Convert the hex address to a base58 (TRON) address
//       //     recipientAddress = tronWeb.address.fromHex(recipientAddressHex);
//       //   } else {
//       //     console.log("No TransferContract found in transaction.");
//       //   }
//       // } else {
//       //   console.log("Invalid transaction data.");
//       // }
//       console.log("reciepent check", recipientAddress);
//       // Verify that the amount matches the expected value in SUN and the transaction was successful
//       if (
//         expectedAmountInSun.toString() == actualAmount.toString() &&
//         transactionStatus === "SUCCESS" &&
//         recipientAddress == walletAddress
//       ) {
//         console.log(
//           "Transaction is valid, amount matches, and the transaction was successful."
//         );
//         let updateDetails = {
//           txHash: transactionInfo.txID,
//           txStatus: "SUCCESS",
//           processed: "PENDING",
//         };
//         let query = {
//           reference_id: reference_id.toString(),
//         };

//         const transaction = await findOneAndUpdate(
//           OffRampTransaction,
//           query,
//           updateDetails
//         );
//         if (transaction) {
//           const fiatAccount = await findRecord(FiatAccount, {
//             fiatAccountId: transaction.fiatAccountId,
//           });
//           console.log(fiatAccount);

//           console.log(request.user);
//           const phone = request.user.phone.replace("+91-", "");
//           // let body = {
//           //   name: fiatAccount.account_name,
//           //   email: request.user.email,
//           //   phone: phone,
//           //   amount: transaction.fromAmount,
//           //   account_number: fiatAccount.fiatAccount,
//           //   ifsc: fiatAccount.ifsc,
//           //   bank_name: fiatAccount.ifsc,
//           //   method: "IMPS",
//           //   customer_id: request.user.customerId,
//           // };

//           const transactionID = generateTransactionId();

//           /*
//             kwikpaisa payouts
//             let body = {
//               id:request.user.customerId,
//               emailId: "test@payhub",
//               amount: transaction.toAmount,
//               customer_name: "tushant",
//               customer_email: request.user.email,
//               customer_phone: phone,
//               account_number: fiatAccount.fiatAccount,
//               customer_upiId: "success@upi",
//               bank_ifsc: fiatAccount.ifsc,
//               account_name: fiatAccount.account_name,
//               bank_name: fiatAccount.bank_name,
//               customer_address: "xyz",
//               method: "bank",
//               transaction_id: reference_id.toString(),
//             };
//             console.log(body);
//             const payoutRequest = await createPayoutBankRequest(
//               response.token,
//               body
//             );

//             const payoutRequest = await createPayoutBankRequestPayhub(
//               response.responseData,
//               body
//             );
//             const payoutRequest = await createInstantPayoutBankRequest(body)
//             */

//           //gennpay payouts
//           const payoutRequest = await sendFundTransferRequest(
//             process.env.GENNPAYAPIKEY,
//             transactionID.toString(),
//             transaction.toAmount.toString(),
//             fiatAccount.fiatAccount,
//             fiatAccount.ifsc,
//             "IMPS",
//             {
//               accountName: fiatAccount.account_name,
//               bankName: fiatAccount.bank_name,
//             }
//           );

//           //  //razorpay payouts
//           // let body = {
//           //   id:request.user.customerId,
//           //   emailId: request.user.email,
//           //   amount: transaction.toAmount,
//           //   customer_name: "tushant",
//           //   customer_email: request.user.email,
//           //   customer_phone: phone,
//           //   account_number: fiatAccount.fiatAccount,
//           //   customer_upiId: "success@upi",
//           //   bank_ifsc: fiatAccount.ifsc,
//           //   account_name: fiatAccount.account_name,
//           //   bank_name: fiatAccount.bank_name,
//           //   customer_address: "xyz",
//           //   method: "bank",
//           //   transaction_id: reference_id.toString(),
//           // };
//           // const payoutRequest = await createRazorpayPayoutService(body)
//           //   //razorpay payouts end
//           console.log(payoutRequest);
//           if (payoutRequest.code == 200 && payoutRequest.data.transaction_id) {
//             let updatedData = {
//               name: fiatAccount.account_name,
//               email: request.user.email,
//               phone: phone,
//               amount: transaction.fromAmount,
//               account_number: fiatAccount.fiatAccount,
//               ifsc: fiatAccount.ifsc,
//               bank_name: fiatAccount.bank_name,
//               method: "IMPS",
//               customer_id: request.user.customerId,
//             };
//             updatedData.transaction_id =
//               payoutRequest.data.transaction_id.toString();
//             updatedData.reference_id = reference_id.toString();
//             updatedData.user_id = request.user.id;
//             updatedData.txHash = txHash;
//             const payoutsData = await createNewRecord(Payout, updatedData);
//             transaction.payout_id =
//               payoutRequest.data.transaction_id.toString();
//             transaction.save();
//             console.log(payoutsData);
//             return reply
//               .status(200)
//               .send(
//                 responseMappingWithData(200, "success", payoutRequest.data)
//               );
//           } else {
//             return reply
//               .status(500)
//               .send(responseMappingError(500, `Internal server error`));
//           }

//           // console.log(transaction)
//         } else {
//           console.log("transaction doesnt belong to our system");
//           return reply
//             .status(400)
//             .send(
//               responseMappingError(
//                 500,
//                 `transaction doesnt belong to our system`
//               )
//             );
//         }
//         //const transaction = await OffRampTransaction.create(body)
//         // Mark payment as successful in your system
//       } else if (expectedAmountInSun.toString() !== actualAmount.toString()) {
//         console.log("Transaction amount does not match the expected value.");
//         return reply
//           .status(400)
//           .send(
//             responseMappingError(
//               500,
//               `Transaction amount does not match the expected value.`
//             )
//           );
//       } else if (transactionStatus !== "SUCCESS") {
//         console.log("Transaction was not successful.");
//         return reply
//           .status(400)
//           .send(responseMappingError(500, `Transaction was not successful`));
//       }
//     } else {
//       console.log("Transaction not found.");
//       return reply
//         .status(400)
//         .send(responseMappingError(404, `Transaction not found.`));
//     }
//   } catch (error) {
//     console.error("Error verifying transaction:", error);
//     return reply
//       .status(500)
//       .send(responseMappingError(404, `Internal Server Error.`));
//   }
// }



export async function verifyTransaction(details) {
  try {
    const {
      fromAmount,
      reference_id,
      txHash,
    } = details;

   

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
    console.log(payoutTx);
    if (
      transaction &&
      (transaction?.status === "PENDING" ||
        transaction?.processed == "PENDING") &&
      transaction?.txHash &&
      transaction?.payout_id
    ) {      
      throw new Error("Transaction is already under process please check status from history")
    }
    console.log(transaction?.processed);
    if (transaction && transaction?.processed === "SUCCESS") {
      throw new Error("Transaction is already under process please check status from history")
    }

    if (transaction.length == 0) {
      throw new Error("Transaction doesnt belong to our system")
    }
    if (transaction.fromAmount !== fromAmount) {
      throw new Error("Invalid amount")
    }
    if (payoutHash && payoutHash?.status === "SUCCESS") {
      throw new Error('Transaction has already been processed')
    }
    if (payoutHash && payoutHash?.status === "PENDING") {
      throw new Error('Transaction is under process currently')
    }

    if (transaction.txHash && transaction.txHash !== txHash) {
      throw new Error('transaction has already been processed with different hash')
    }

    if (
      transaction.txStatus == "success" &&
      transaction.user_id == request.user.id &&
      payoutTx.transaction_id
    ) {
      console.log("transaction has already been processed");
      throw new Error('Transaction has already been processed')
    }
    if (transaction && transaction.user_id !== request.user.id) {
      console.log("Transaction belongs to another user");
      throw new Error('Transaction belongs to another user')
    }

    const transactionInfo = await tronWeb.trx
      .getTransaction(txHash)
      .catch((error) => {
        throw new Error('Transaction not found.')
      });
    console.log(transactionInfo);
    if (!transactionInfo || !transactionInfo.txID) {
      console.log("Transaction not found.");
      throw new Error('Transaction not found.')
    }

    if (transactionInfo) {
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
        throw new Error('Invalid amount')
      }
      // Check if the transaction was successful
      const transactionStatus = transactionInfo.ret[0].contractRet;
      const rawData = transactionInfo.raw_data;
      let recipientAddress = await getRecipientAddressUsingTronscan(txHash);
      console.log("reciepent check", recipientAddress);
      // Verify that the amount matches the expected value in SUN and the transaction was successful
      if (
        expectedAmountInSun.toString() == actualAmount.toString() &&
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
          await OffRampLiveTransactions.destroy({
            where: {
              reference_id: reference_id.toString(),
            },
          });
          const fiatAccount = await findRecord(FiatAccount, {
            fiatAccountId: transaction.fiatAccountId,
          });
          console.log(fiatAccount);

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

          const transactionID = generateTransactionId();

          /*
            kwikpaisa payouts
            let body = {
              id:request.user.customerId,
              emailId: "test@payhub",
              amount: transaction.toAmount,
              customer_name: "tushant",
              customer_email: request.user.email,
              customer_phone: phone,
              account_number: fiatAccount.fiatAccount,
              customer_upiId: "success@upi",
              bank_ifsc: fiatAccount.ifsc,
              account_name: fiatAccount.account_name,
              bank_name: fiatAccount.bank_name,
              customer_address: "xyz",
              method: "bank",
              transaction_id: reference_id.toString(),
            };
            console.log(body);
            const payoutRequest = await createPayoutBankRequest(
              response.token,
              body
            );

            const payoutRequest = await createPayoutBankRequestPayhub(
              response.responseData,
              body
            );
            const payoutRequest = await createInstantPayoutBankRequest(body)
            */

          //gennpay payouts
          const payoutRequest = await sendFundTransferRequest(
            process.env.GENNPAYAPIKEY,
            transactionID.toString(),
            transaction.toAmount.toString(),
            fiatAccount.fiatAccount,
            fiatAccount.ifsc,
            "IMPS",
            {
              accountName: fiatAccount.account_name,
              bankName: fiatAccount.bank_name,
            }
          );

          //  //razorpay payouts
          // let body = {
          //   id:request.user.customerId,
          //   emailId: request.user.email,
          //   amount: transaction.toAmount,
          //   customer_name: "tushant",
          //   customer_email: request.user.email,
          //   customer_phone: phone,
          //   account_number: fiatAccount.fiatAccount,
          //   customer_upiId: "success@upi",
          //   bank_ifsc: fiatAccount.ifsc,
          //   account_name: fiatAccount.account_name,
          //   bank_name: fiatAccount.bank_name,
          //   customer_address: "xyz",
          //   method: "bank",
          //   transaction_id: reference_id.toString(),
          // };
          // const payoutRequest = await createRazorpayPayoutService(body)
          //   //razorpay payouts end
          console.log(payoutRequest);
          if (payoutRequest.code == 200 && payoutRequest.data.transaction_id) {
            let updatedData = {
              name: fiatAccount.account_name,
              email: request.user.email,
              phone: phone,
              amount: transaction.fromAmount,
              account_number: fiatAccount.fiatAccount,
              ifsc: fiatAccount.ifsc,
              bank_name: fiatAccount.bank_name,
              method: "IMPS",
              customer_id: request.user.customerId,
            };
            updatedData.transaction_id =
              payoutRequest.data.transaction_id.toString();
            updatedData.reference_id = reference_id.toString();
            updatedData.user_id = request.user.id;
            updatedData.txHash = txHash;
            const payoutsData = await createNewRecord(Payout, updatedData);
            transaction.payout_id =
              payoutRequest.data.transaction_id.toString();
            transaction.save();
            console.log(payoutsData);
            return true
          } else {
            throw new Error("Unable to process")
          }
          // console.log(transaction)
        } else {
          console.log("transaction doesnt belong to our system");
          throw new Error("Transaction doesnt belong to our system")
        }
        //const transaction = await OffRampTransaction.create(body)
        // Mark payment as successful in your system
      } else if (expectedAmountInSun.toString() !== actualAmount.toString()) {
        console.log("Transaction amount does not match the expected value.");
        throw new Error("Transaction amount does not match the expected value.")
      } else if (transactionStatus !== "SUCCESS") {
        console.log("Transaction was not successful.");
        throw new Error("Transaction was not successful")
      }
    } else {
      console.log("Transaction not found.");
      throw new Error("Transaction not successful")
 
    }
  } catch (error) {
    console.error("Error verifying transaction:", error);
    throw error
    
  }
}