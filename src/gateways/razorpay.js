import Razorpay from "razorpay";
import fetch from "node-fetch";
import CryptoJS from "crypto-js";
import { createHash } from "crypto";
import { responseMappingError, responseMappingWithData } from "../utils/responseMapper";

// Function to generate transaction ID
function generateTransactionId(length = 12) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export async function createQrCode() {
  try {
    const currentUnixTime = Math.floor(Date.now() / 1000);
    const threeMinutesLater = currentUnixTime + 3 * 60;

    const response = await razorpay.qrCode.create({
      type: "upi_qr",
      name: "Store Front Display",
      usage: "single_use",
      fixed_amount: true,
      payment_amount: 300,
      description: "For Store 1",
      close_by: threeMinutesLater
    });

    if (!response) throw new Error("Unable to generate QR code");
    return responseMappingWithData(200, "QR code created successfully", response);
  } catch (error) {
    console.error("Error in createQrCode:", error);
    return responseMappingError(500, "Internal server error", "Unable to create QR code");
  }
}

export async function createRazorpayPayoutService(details) {
  try {
    const referenceId = generateTransactionId();
    const contactId = await createRazorpayContact(details);

    let payoutData;

      const fundAccountId = await createRazorpayFundAccountForBank(details, contactId);
      payoutData = await createPayout(fundAccountId, details.amount, "IMPS",referenceId);

    return responseMappingWithData(200, "Payout created successfully",{ transaction_id: payoutData.id});
  } catch (error) {
    console.error("Error in createRazorpayPayoutService:", error);
    return responseMappingError(500, "Internal server error", "Unable to create payout");
  }
}

async function createRazorpayContact(details) {
  try {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    const basicAuth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
    const request_body = {
      name: details.account_name ? details.account_name : "Test",
      email: details.email ? details.email : "test@gmail.com",
      contact: details.contact,
      type: "employee",
      reference_id: "Acme Contact ID 12345",
      notes: {
        random_key_1: "Make it so.",
        random_key_2: "Tea. Earl Grey. Hot.",
      },
    };
    const response = await fetch("https://api.razorpay.com/v1/contacts", {
      method: "POST",
      headers: {
        Authorization: `Basic ${basicAuth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request_body),
    });
    console.log("resppnse", response);
    if (!response.ok) {
      console.log("coming inside this");
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    console.log("returning datat id", data);
    return data?.id;
  } catch (err) {
    console.log(`razorpayService.js-createRazorpayContact`, err);
    throw new Error("Unable to do payout");
  }
}

async function createRazorpayFundAccountForBank(details, contact_id) {
  try {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    const basicAuth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
    const request_body = {
      contact_id: contact_id,
      account_type: "bank_account",
      bank_account: {
        name: details.account_name,
        ifsc: details.bank_ifsc,
        account_number: details.account_number,
      },
    };
    console.log("request_body fund acc", request_body);
    const response = await fetch("https://api.razorpay.com/v1/fund_accounts", {
      method: "POST",
      headers: {
        Authorization: `Basic ${basicAuth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request_body),
    });
    console.log("resp", response);
    if (!response.ok) {
      console.log("fund account response",response);
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data.id;
  } catch (err) {
    console.log(`razorpayService.js-create fund account`, err);
  }
}

const createPayout = async (fund_account_id, amount, method) => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  console.log()
  const basicAuth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
  const payoutData = {
    account_number: process.env.RAZORPAY_ACCOUNT_ID,
    fund_account_id: fund_account_id,
    amount: amount * 100,
    currency: "INR",
    mode: method,
    purpose: "payout",
    queue_if_low_balance: true,
    reference_id: `${Date.now()}`,
    narration: "Acme Corp Fund Transfer",
    notes: {
      notes_key_1: "Tea, Earl Grey, Hot",
      notes_key_2: "Tea, Earl Grey… decaf.",
    },
  };

  try {
    const response = await fetch("https://api.razorpay.com/v1/payouts", {
      method: "POST",
      headers: {
        Authorization: `Basic ${basicAuth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payoutData),
    });
    //console.log("resp", response);
    if (!response.ok) {
      console.log(await response.json());
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    console.log("here 1",data);
    return data;
  } catch (error) {
    console.error("Error creating payout:", error);
    throw new Error("Unable to do payout");
  }
};
