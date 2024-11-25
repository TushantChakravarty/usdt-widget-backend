import { findOneAndUpdate, findRecord } from "../Dao/dao.js";
import db from "../models/index.js";
import { verifyTransactionDetails } from "./onramp.controller.js";

const { User, OnRampTransaction, OffRampTransaction, Payout } = db;

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
  const {
    transaction_id,
    amount,
    status,
    transaction_date,
    utr,
    usdtRate,
    customer_id,
    usdtValue,
  } = request.body;
  const payoutTx = await findRecord(Payout, {
    transaction_id: transaction_id,
  });
//   console.log(payoutTx)
  if(!payoutTx.transaction_id)
  {
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

export async function onrampCallback(request, reply) {
  console.log(request.body);
  const data = request.body
  const {
    transaction_id,
    amount,
    status,
    transaction_date,
    utr,
    usdtRate,
    customer_id,
    usdtValue,
  } = request.body;

 
  const transaction = await findRecord(OnRampTransaction, {
    reference_id: transaction_id,
  });
  if(!transaction.reference_id)
  {
    reply.status(400).send({ message: "Tx not found" });
  }
  if (transaction) {
    if (status?.toLowerCase() == "success") {
    //   console.log("payout found", payoutTx);
    //   console.log("offramp tx found", transaction);

      transaction.status = "SUCCESS";
      transaction.utr = utr
      transaction.amount = amount
      const updatedOnramp = await transaction.save();
      console.log("updated tx", updatedOnramp);
    //   console.log("updated payout", updatedPayout);
      if (updatedOnramp) {
        const data = await verifyTransactionDetails({reference_id:transaction.reference_id})
        console.log(data)
        reply.status(200).send({ message: "success" });
      }
    } else {
      transaction.status = "FAILED";
      transaction.utr = utr
      transaction.amount = amount
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
