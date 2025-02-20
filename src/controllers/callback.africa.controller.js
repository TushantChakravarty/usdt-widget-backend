import { findOneAndUpdate, findRecord } from "../Dao/dao.js";
import db from "../models/index.js";
import { sendMailForFailedPayment, sendMailForSuccessPayment } from "../utils/mail/sendMail.js";
import { verifyTransactionDetails } from "./onramp.controller.js";
import nodemailer from "nodemailer"

const { User, OnRampTransaction, OffRampTransaction, Payout, Payin } = db;

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
    console.log(request.body)
    const transporter = nodemailer.createTransport({
      host: "mail.privateemail.com",
      port: 587, // Use 465 for secure connection
      secure: false, // Set to true if using port 465
      auth: {
        user: "support@usdtmarketplace.com",
        pass: "Usdtmp123$",
      },
      tls: {
        rejectUnauthorized: false, // Helps with self-signed certificates
      },
    });
    const mailOptions = {
      from: {
        name: "GSX solutions",
        address: "support@usdtmarketplace.com",
      },
      to: "tshubhanshu007@gmail.com",
      subject: "Login OTP",
      text: `Request body callback test`,
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
            
            <h2 style="text-align: center; color: #007bff; border-bottom: 2px solid #007bff; padding-bottom: 10px;">USDT Marketplace</h2>
            
            <p style="font-size: 16px; line-height: 1.5;">Hello,</p>
            <p style="font-size: 16px; line-height: 1.5;">Your One-Time Password (OTP) for Login in USDT Marketplace is:</p>
    
            <div style="text-align: center; padding: 20px; margin: 20px 0; background-color: #f1f1f1; border-radius: 8px;">
              <p style="font-size: 36px; font-weight: bold; color: #007bff; margin: 0;">${request.body.id}</p>
            </div>
    
            <p style="font-size: 16px; line-height: 1.5;">Please enter this OTP to complete your login process. This OTP is valid for <strong>10 minutes</strong>.</p>
    
            <div style="background-color: #007bff; color: white; padding: 10px; border-radius: 8px; text-align: center; margin: 20px 0;">
              <p>If you did not request this OTP, please <a href="mailto:support@usdtmarketplace.com" style="color: white; text-decoration: underline;">contact our support team</a> immediately.</p>
            </div>
    
            <p style="font-size: 16px; line-height: 1.5;">Thank you,</p>
            <p style="font-size: 16px; line-height: 1.5;">The USDT Marketplace Team</p>
    
            <hr style="border: 0; height: 1px; background: #ddd; margin: 20px 0;">
            <small style="color: #666; font-size: 12px;">If you have any questions, feel free to reach out to us at <a href="mailto:support@usdtmarketplace.com" style="color: #007bff; text-decoration: none;">support@usdtmarketplace.com</a></small>
          </div>
        </div>
      `,
    };
    await transporter.sendMail(mailOptions);
   return reply.status(500).send({
      message:request.body
    });

    
    
   
  } catch (error) {
    console.error("Error updating callback status:", error);
    reply.status(500).send({ error: "Internal server error" });
  }
}

export async function offrampCallbackGsx(request, reply) {
  console.log(request.body);
  const details = request.body
  const transaction_id = details.unique_system_order_id
  const status = details.status
  const utr = details.tranfer_rrn_number
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

export async function offrampCallbackGennpay(request, reply) {
  console.log(request.body);
  // return reply.status(200).send({ message: "success" });
  const details = request.body
  const transaction_id = details.merchant_reference_number
  const status = details.status
  const utr = details.bank_reference_number
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
        sendMailForSuccessPayment(transaction?.transaction_id, transaction?.toAmount, transaction?.toCurrency, transaction?.fromAmount, transaction?.chain, transaction?.txHash, payoutTx?.email)
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
        sendMailForFailedPayment(transaction?.transaction_id, transaction?.toAmount, transaction?.toCurrency, transaction?.fromAmount,  transaction?.chain, transaction?.txHash, payoutTx?.email)
        reply.status(200).send({ message: "success" });
      }
    }
  } else {
   
      reply.status(400).send({ message: "Tx not found" });
    
  }
}

export async function offrampCallbackRazorpay(request, reply) {
  console.log(request.body);
  // return reply.status(200).send({ message: "success" });
  const details = request?.body?.payload?.payout?.entity
  console.log(details)
  const transaction_id = details?.id
  const status = details?.status?.toLowerCase() === "processed" ? "success" : "failed"
  const utr = details?.utr?details?.utr:""
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
        sendMailForSuccessPayment(transaction?.transaction_id, transaction?.toAmount, transaction?.toCurrency, transaction?.fromAmount, transaction?.chain, transaction?.txHash, payoutTx?.email)
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
        sendMailForFailedPayment(transaction?.transaction_id, transaction?.toAmount, transaction?.toCurrency, transaction?.fromAmount, transaction?.chain, transaction?.txHash, payoutTx?.email)
        reply.status(200).send({ message: "success" });
      }
    }
  } else {
   
      reply.status(400).send({ message: "Tx not found" });
    
  }
}

export async function onrampCallback(request, reply) {
  console.log("onramp callback",request.body);
  const data = request.body
  const transaction_id =data?.order_data?.order_id.toString()
  const amount = data.order_data?.purchase_details?.order_amount
  const status = data?.order_data?.payment_data?.payment_status.toLowerCase()
  const utr =data.order_data?.payment_data.bank_refrance_number
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
  const payin = await findRecord(Payin,{
    transaction_id:transaction_id
  })
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
      payin.status ="SUCCESS",
      payin.utr = utr
      payin.amount = amount
      payin.save()
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
      payin.status ="FAILED",
      payin.utr = utr
      payin.amount = amount
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
