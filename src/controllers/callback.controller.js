import { findOneAndUpdate, findRecord, findRecordNew } from "../Dao/dao.js";
import db from "../models/index.js";
import {
  sendMailForFailedPayment,
  sendMailForSuccessPayment,
} from "../utils/mail/sendMail.js";
import {
  responseMapping,
  responseMappingError,
  responseMappingWithData,
} from "../utils/responseMapper.js";
import { enqueueCallback } from "../utils/sqs/producer.js";
import { verifyTransactionDetails } from "./onramp.controller.js";
import { Op } from "sequelize";

const {
  User,
  OnRampTransaction,
  OffRampTransaction,
  Payout,
  Payin,
  OffRampLiveTransactions,
} = db;

/**
 * get otp callback kyc.
 * @controller user
 * @route POST /api/v1/callback/kyc
 * @param {Object} request - The request object.
 * @param {Object} reply - The reply object.
 * @throws {Error} If an error occurs while signing up.
 */
export async function callbackHandler(request, reply) {
  try {
    const details = request.body;
    console.log(details);
    if (details.status === "OTP_COMPLETED") {
      let user = await User.scope("private").findOne({
        where: {
          customerId: details.metadata.customerId,
        },
      });
      console.log("user", user);
      if (user) {
        // Update the otp field in the kyc object
        user.kyc = {
          ...user.kyc,
          otp: true,
        };
        console.log("updated check", user);

        // Save the updated user object
        const updated = await user.save();
        console.log("updated", updated);
        reply.status(200).send({ message: "success" });
      } else {
        reply.status(400).send({ error: "User not found" });
      }
    }
    if (details.status === "BASIC_KYC_COMPLETED") {
      let user = await User.scope("private").findOne({
        where: {
          customerId: details.metadata.customerId,
        },
      });
      console.log("user", user);
      if (user) {
        // Update the otp field in the kyc object
        user.kyc = {
          ...user.kyc,
          basic: true,
        };
        console.log("updated check", user);

        // Save the updated user object
        const updated = await user.save();
        console.log("updated", updated);
        reply.status(200).send({ message: "success" });
      } else {
        reply.status(400).send({ error: "User not found" });
      }
    }
    if (details.status === "INTERMEDIATE_KYC_COMPLETED") {
      let user = await User.scope("private").findOne({
        where: {
          customerId: details.metadata.customerId,
        },
      });
      console.log("user", user);
      if (user) {
        // Update the otp field in the kyc object
        user.kyc = {
          ...user.kyc,
          intermediate: true,
        };
        console.log("updated check", user);

        // Save the updated user object
        const updated = await user.save();
        console.log("updated", updated);
        reply.status(200).send({ message: "success" });
      } else {
        reply.status(400).send({ error: "User not found" });
      }
    }
    if (details.status === "ADVANCE_KYC_COMPLETED") {
      let user = await User.scope("private").findOne({
        where: {
          customerId: details.metadata.customerId,
        },
      });
      console.log("user", user);
      if (user) {
        // Update the otp field in the kyc object
        user.kyc = {
          ...user.kyc,
          advanced: true,
        };
        console.log("updated check", user);

        // Save the updated user object
        const updated = await user.save();
        console.log("updated", updated);
        reply.status(200).send({ message: "success" });
      } else {
        reply.status(400).send({ error: "User not found" });
      }
    }
    if (details.status === "COMPLETED") {
      let user = await User.scope("private").findOne({
        where: {
          customerId: details.metadata.customerId,
        },
      });
      console.log("user", user);
      if (user) {
        // Update the otp field in the kyc object
        //user.isKycCompleted = true
        user.kyc = {
          ...user.kyc,
          completed: true,
        };
        console.log("updated check", user);

        // Save the updated user object
        const updated = await user.save();
        console.log("updated", updated);
        reply.status(200).send({ message: "success" });
      } else {
        reply.status(400).send({ error: "User not found" });
      }
    }
    if (details.status === "EDD_COMPLETED") {
      let user = await User.scope("private").findOne({
        where: {
          customerId: details.metadata.customerId,
        },
      });
      console.log("user", user);
      if (user) {
        // Update the otp field in the kyc object
        user.isKycCompleted = true;
        // user.kyc = {
        //     ...user.kyc,
        //     completed: true,
        // };
        console.log("updated check", user);

        // Save the updated user object
        const updated = await user.save();
        console.log("updated", updated);
        reply.status(200).send({ message: "success" });
      } else {
        reply.status(400).send({ error: "User not found" });
      }
    }
    if (details.eventType == "ONRAMP") {
      let transaction = await OnRampTransaction.findOne({
        where: {
          reference_id: details.referenceId.toString(),
        },
      });
      if (details.status === "FIAT_DEPOSIT_RECEIVED") {
        if (transaction) {
          // Update the status field in the transaction
          transaction.status = details.status;
          // Save the updated transaction object
          const updated = await transaction.save();
          console.log("updated", updated);
          reply.status(200).send({ message: "success" });
        } else {
          reply.status(400).send({ error: "transaction not found" });
        }
      }
      if (details.status === "TRADE COMPLETED") {
        if (transaction) {
          // Update the status field in the transaction
          transaction.status = details.status;
          // Save the updated transaction object
          const updated = await transaction.save();
          console.log("updated", updated);
          reply.status(200).send({ message: "success" });
        } else {
          reply.status(400).send({ error: "transaction not found" });
        }
      }
      if (details.status === "ON_CHAIN_INITIATED") {
        if (transaction) {
          // Update the status field in the transaction
          transaction.status = details.status;
          // Save the updated transaction object
          const updated = await transaction.save();
          console.log("updated", updated);
          reply.status(200).send({ message: "success" });
        } else {
          reply.status(400).send({ error: "transaction not found" });
        }
      }

      // if (details.status === "ON_CHAIN_COMPLETED") {
      //     let transaction = await OnRampTransaction.findOne({
      //         where: {
      //             reference_id: details.referenceId,
      //         },
      //     });
      //     if (transaction) {
      //         // Update the status field in the transaction
      //         transaction.status =details.status
      //         // Save the updated transaction object
      //         const updated = await transaction.save();
      //         console.log('updated',updated)
      //         reply.status(200).send({ message: "success" });
      //     }else{
      //         reply.status(400).send({ error: "transaction not found" });
      //     }
      // }
      if (details.status === "ON_CHAIN_COMPLETED") {
        if (transaction) {
          // Update the status field in the transaction
          transaction.status = "SUCCESS";
          // Save the updated transaction object
          const updated = await transaction.save();
          console.log("updated", updated);
          reply.status(200).send({ message: "success" });
        } else {
          reply.status(400).send({ error: "transaction not found" });
        }
      }

      if (details.status === "FAILED") {
        if (transaction) {
          // Update the status field in the transaction
          transaction.status = "FAILED";
          // Save the updated transaction object
          const updated = await transaction.save();
          console.log("updated", updated);
          reply.status(200).send({ message: "success" });
        } else {
          reply.status(400).send({ error: "transaction not found" });
        }
      }
    }

    if (details.eventType === "OFFRAMP") {
      let transaction = await OffRampTransaction.findOne({
        where: {
          reference_id: details.referenceId.toString(),
        },
      });
      if (!transaction) {
        reply.status(400).send({ error: "transaction not found" });
      }
      if (details.status === "ON_CHAIN_DEPOSIT_RECEIVED") {
        transaction.status = details.status;
        // Save the updated transaction object
        const updated = await transaction.save();
        console.log("updated", updated);
        return reply.status(200).send({ message: "success" });
      }
      if (details.status === "TRADE_COMPLETED") {
        transaction.status = details.status;
        // Save the updated transaction object
        const updated = await transaction.save();
        console.log("updated", updated);
        return reply.status(200).send({ message: "success" });
      }

      if (details.status === "FIAT_TRANSFER_INITIATED") {
        transaction.status = details.status;
        // Save the updated transaction object
        const updated = await transaction.save();
        console.log("updated", updated);
        return reply.status(200).send({ message: "success" });
      }

      if (details.status === "FIAT_TRANSFER_COMPLETED") {
        transaction.status = "SUCCESS";
        // Save the updated transaction object
        const updated = await transaction.save();
        console.log("updated", updated);
        return reply.status(200).send({ message: "success" });
      }
      if (details.status === "FAILED") {
        transaction.status = details.status;
        // Save the updated transaction object
        const updated = await transaction.save();
        console.log("updated", updated);
        return reply.status(200).send({ message: "success" });
      }
    }
  } catch (error) {
    console.error("Error updating callback status:", error);
    reply.status(500).send({ error: "Internal server error" });
  }
}

export async function offrampCallbackGsx(request, reply) {
  console.log(request.body);
  const details = request.body;
  const transaction_id = details.unique_system_order_id;
  const status = details.status;
  const utr = details.tranfer_rrn_number;
  // const {
  //   transaction_id,
  //   amount,
  //   status,
  //   transaction_date,
  //   utr,
  //   usdtRate,
  //   customer_id,
  //   usdtValue,
  // } = request.body;
  const payoutTx = await findRecord(Payout, {
    transaction_id: transaction_id,
  });
  //   console.log(payoutTx)
  if (!payoutTx.transaction_id) {
    reply.status(400).send({ message: "Tx not found" });
  }
  const transaction = await findRecord(OffRampTransaction, {
    reference_id: payoutTx.reference_id,
  });
  if (payoutTx && transaction) {
    if (status?.toLowerCase() == "success") {
      //   console.log("payout found", payoutTx);
      //   console.log("offramp tx found", transaction);

      transaction.processed = "SUCCESS";
      transaction.status = "SUCCESS";
      payoutTx.status = "SUCCESS";
      payoutTx.utr = utr;
      const updatedOfframp = await transaction.save();
      const updatedPayout = await payoutTx.save();
      console.log("updated tx", updatedOfframp);
      console.log("updated payout", updatedPayout);
      if (updatedOfframp && updatedPayout) {
        reply.status(200).send({ message: "success" });
      }
    } else {
      transaction.processed = "FAILED";
      payoutTx.status = "FAILED";
      payoutTx.utr = utr;
      const updatedOfframp = await transaction.save();
      const updatedPayout = await payoutTx.save();
      console.log("updated tx", updatedOfframp);
      console.log("updated payout", updatedPayout);
      if (updatedOfframp && updatedPayout) {
        reply.status(200).send({ message: "success" });
      }
    }
  } else {
    reply.status(400).send({ message: "Tx not found" });
  }
}

export async function offrampCallbackGennpay(request, reply) {
  console.log(request.body);
  // return reply.status(200).send({ message: "success" });
  const details = request.body;
  const transaction_id = details.merchant_reference_number;
  const status = details.status;
  const utr = details.bank_reference_number;
  // const {
  //   transaction_id,
  //   amount,
  //   status,
  //   transaction_date,
  //   utr,
  //   usdtRate,
  //   customer_id,
  //   usdtValue,
  // } = request.body;
  const payoutTx = await findRecord(Payout, {
    transaction_id: transaction_id,
  });
  //   console.log(payoutTx)
  if (!payoutTx.transaction_id) {
    reply.status(400).send({ message: "Tx not found" });
  }
  const transaction = await findRecord(OffRampTransaction, {
    reference_id: payoutTx.reference_id,
  });

  if (payoutTx && transaction) {
    if (status?.toLowerCase() == "success") {
      //   console.log("payout found", payoutTx);
      //   console.log("offramp tx found", transaction);

      transaction.processed = "SUCCESS";
      transaction.status = "SUCCESS";
      payoutTx.status = "SUCCESS";
      payoutTx.utr = utr;
      const updatedOfframp = await transaction.save();
      const updatedPayout = await payoutTx.save();
      console.log("updated tx", updatedOfframp);
      console.log("updated payout", updatedPayout);
      if (updatedOfframp && updatedPayout) {
        sendMailForSuccessPayment(
          transaction?.transaction_id,
          transaction?.toAmount,
          transaction?.toCurrency,
          transaction?.fromAmount,
          transaction?.chain,
          transaction?.txHash,
          payoutTx?.email
        );
        reply.status(200).send({ message: "success" });
      }
    } else {
      transaction.processed = "FAILED";
      payoutTx.status = "FAILED";
      payoutTx.utr = utr;
      const updatedOfframp = await transaction.save();
      const updatedPayout = await payoutTx.save();
      console.log("updated tx", updatedOfframp);
      console.log("updated payout", updatedPayout);
      if (updatedOfframp && updatedPayout) {
        sendMailForFailedPayment(
          transaction?.transaction_id,
          transaction?.toAmount,
          transaction?.toCurrency,
          transaction?.fromAmount,
          transaction?.chain,
          transaction?.txHash,
          payoutTx?.email
        );
        reply.status(200).send({ message: "success" });
      }
    }
  } else {
    reply.status(400).send({ message: "Tx not found" });
  }
}

export async function offrampCallbackRazorpay(request, reply) {
  try {
    console.log(request.body);
    // return reply.status(200).send({ message: "success" });
    const details = request?.body?.payload?.payout?.entity;
    //console.log(details)
    const transaction_id = details?.id;
    const status =
      details?.status?.toLowerCase() === "processed" ? "success" : "failed";
    const utr = details?.utr ? details?.utr : "";
    // const {
    //   transaction_id,
    //   amount,
    //   status,
    //   transaction_date,
    //   utr,
    //   usdtRate,
    //   customer_id,
    //   usdtValue,
    // } = request.body;
    const payoutTx = await findRecord(Payout, {
      transaction_id: transaction_id,
    });
    console.log("payout tx data", payoutTx);
    if (payoutTx?.length == 0) {
      return reply.status(200).send({ message: "Tx not found" });
    }
    if (details?.status?.toLowerCase() === "queued") {
      return;
    }
    console.log(payoutTx);
    if (!payoutTx?.transaction_id) {
      return reply.status(200).send({ message: "Tx not found" });
    }
    const transaction = await findRecord(OffRampTransaction, {
      reference_id: payoutTx?.reference_id,
    });

    if (payoutTx && transaction) {
      if (status?.toLowerCase() == "success") {
        //   console.log("payout found", payoutTx);
        //   console.log("offramp tx found", transaction);

        transaction.processed = "SUCCESS";
        transaction.status = "SUCCESS";
        payoutTx.status = "SUCCESS";
        payoutTx.utr = utr;
        const updatedOfframp = await transaction.save();
        const updatedPayout = await payoutTx.save();
        console.log("updated tx", updatedOfframp);
        console.log("updated payout", updatedPayout);
        if (updatedOfframp && updatedPayout) {
          sendMailForSuccessPayment(
            transaction?.transaction_id,
            transaction?.toAmount,
            transaction?.toCurrency,
            transaction?.fromAmount,
            transaction?.chain,
            transaction?.txHash,
            payoutTx?.email
          );
          return reply.status(200).send({ message: "success" });
        }
      } else {
        transaction.processed = "FAILED";
        payoutTx.status = "FAILED";
        payoutTx.utr = utr;
        const updatedOfframp = await transaction.save();
        const updatedPayout = await payoutTx.save();
        console.log("updated tx", updatedOfframp);
        console.log("updated payout", updatedPayout);
        if (updatedOfframp && updatedPayout) {
          sendMailForFailedPayment(
            transaction?.transaction_id,
            transaction?.toAmount,
            transaction?.toCurrency,
            transaction?.fromAmount,
            transaction?.chain,
            transaction?.txHash,
            payoutTx?.email
          );
          return reply.status(200).send({ message: "success" });
        }
      }
    } else {
      return reply.status(200).send({ message: "Tx not found" });
    }
  } catch (error) {
    return reply.status(200).send({ message: "Tx not found" });
  }
}

export async function onrampCallback(request, reply) {
  console.log("onramp callback", request.body);
  const data = request.body;
  const transaction_id = data?.order_data?.order_id.toString();
  const amount = data.order_data?.purchase_details?.order_amount;
  const status = data?.order_data?.payment_data?.payment_status.toLowerCase();
  const utr = data.order_data?.payment_data.bank_refrance_number;
  // const {
  //   transaction_id,
  //   amount,
  //   status,
  //   transaction_date,
  //   utr,
  //   usdtRate,
  //   customer_id,
  //   usdtValue,
  // } = request.body;

  const transaction = await findRecord(OnRampTransaction, {
    reference_id: transaction_id,
  });
  const payin = await findRecord(Payin, {
    transaction_id: transaction_id,
  });
  if (!transaction.reference_id) {
    reply.status(400).send({ message: "Tx not found" });
  }
  if (transaction) {
    if (status?.toLowerCase() == "success") {
      //   console.log("payout found", payoutTx);
      //   console.log("offramp tx found", transaction);

      transaction.status = "SUCCESS";
      transaction.utr = utr;
      transaction.amount = amount;
      (payin.status = "SUCCESS"), (payin.utr = utr);
      payin.amount = amount;
      payin.save();
      const updatedOnramp = await transaction.save();

      console.log("updated tx", updatedOnramp);
      //   console.log("updated payout", updatedPayout);
      if (updatedOnramp) {
        const data = await verifyTransactionDetails({
          reference_id: transaction.reference_id,
        });
        console.log(data);
        reply.status(200).send({ message: "success" });
      }
    } else {
      transaction.status = "FAILED";
      transaction.utr = utr;
      transaction.amount = amount;
      (payin.status = "FAILED"), (payin.utr = utr);
      payin.amount = amount;
      const updatedOnramp = await transaction.save();
      //   console.log("updated tx", updatedOfframp);
      //   console.log("updated payout", updatedPayout);
      if (updatedOnramp) {
        reply.status(200).send({ message: "success" });
      }
    }
  } else {
    reply.status(400).send({ message: "Tx not found" });
  }
}

export async function callbackMercuryo(request, reply) {
  console.log("hitt");
  console.log(request.body.payload.payment.entity);
  console.log(request.body.payload.qr_code.entity);
}

export async function callbackUsdt(request, reply) {
  try {
    console.log(request.body);
    const { address, counterAddress, asset, txId, chain, amount } =
      request.body;

    if (asset === "USDT_TRON" && chain === "tron-mainnet") {
      // const transactionData = await OffRampLiveTransactions.findOne({
      //   where: {
      //     depositAddress: address,
      //     fromAmount: amount
      //   },
      //   order: [['date', 'DESC'], ['time', 'DESC']]
      // });
      const numericAmount = parseFloat(amount); // parse '10' to 10
      if (isNaN(numericAmount)) {
        throw new Error("Invalid amount format");
      }

      const lower = numericAmount - 5;
      const upper = numericAmount + 5;
      
      console.log(`→ typeof lower: ${typeof lower}, value: ${lower}`);
      console.log(`→ typeof upper: ${typeof upper}, value: ${upper}`);
      
      const transactionData = await OffRampLiveTransactions.findOne({
        where: {
          depositAddress: address,
          fromAmount: {
            [Op.between]: [lower, upper] // must be native numbers
          }
        },
        order: [['date', 'DESC'], ['time', 'DESC']]
      });
      
      console.log("RESULT:", transactionData);
      const user = await findRecordNew(User, {
        id: transactionData?.user_id,
      });
      if (!user) {
        return reply
          .status(400)
          .send(responseMappingError(400, "User not found"));
      }
      if (!transactionData) {
        return reply
          .status(400)
          .send(responseMappingError(400, "Transaction not found"));
      }
      let amt =
        transactionData?.fromAmount !== amount
          ? amount
          : transactionData?.fromAmount;
          console.log('amt', amt)
      const body = {
        fromAmount: amt,
        reference_id: transactionData?.reference_id,
        txHash: txId,
        user: user,
        depositAddress: counterAddress,
      };
      const enqueue_data = await enqueueCallback(body, "verifyTransaction");
      console.log(
        `✅ New USDT deposit detected! TxHash: ${txId}, From: ${counterAddress}, Amount: ${amount} USDT`
      );
      return reply
        .status(200)
        .send(responseMapping(200, "Your verify request is under process"));
    }
  } catch (error) {
    console.error("Error updating callback status:", error);
    reply.status(500).send({ error: "Internal server error" });
  }
}

/**
 * {
  0|widget|address: 'TDacAK43AuWhzX5cdU9Yga9hj1efkR7MZM',
  0|widget|amount: '10',
  0|widget|counterAddress: 'TCxhpEvuD7EARawhYEuVZWixWAKU8r4eX7',
  0|widget|asset: 'TRON',
  0|widget|blockNumber: 70283483,
  0|widget|txId: '815647d281ec29721ecbb3b3a80b2b95ac7768dcd29f0384e3ba52d6b71d0264',
  0|widget|type: 'native',
  0|widget|tokenId: null,
  0|widget|chain: 'tron-mainnet',
  0|widget|subscriptionType: 'ADDRESS_EVENT'0|widget|
}

{
0|widget  |   address: 'TCxhpEvuD7EARawhYEuVZWixWAKU8r4eX7',
0|widget  |   amount: '10',
0|widget  |   counterAddress: 'TDacAK43AuWhzX5cdU9Yga9hj1efkR7MZM',
0|widget  |   asset: 'USDT_TRON',
0|widget  |   blockNumber: 70283565,
0|widget  |   txId: 'e6025e2345e7525f4551edd95f91e4b80d6551f1915c26f91a81c5889264971c',
0|widget  |   type: 'trc20',
0|widget  |   tokenId: null,
0|widget  |   chain: 'tron-mainnet',
0|widget  |   subscriptionType: 'ADDRESS_EVENT'
0|widget  | }
 * 
 * 
 */

// /**
//  * callback for onramp transactionsa=
//  * @controller user
//  * @route POST /api/v1/callback/onramp
//  * @param {Object} request - The request object.
//  * @param {Object} reply - The reply object.
//  * @throws {Error} If an error occurs while signing up.
//  */
// export async function onrampCallback(request, reply) {
//     try {
//         const details = request.body
//         console.log(details)

//     } catch (error) {
//         console.error("Error updating onramp tx status:", error);
//         reply.status(500).send({ error: "Internal server error" });
//     }
// }
