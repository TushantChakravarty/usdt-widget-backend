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

// Function to generate hash key
function generateHashKey(parameters, salt, hashingMethod = "sha512") {
  const sortedKeys = Object.keys(parameters).sort();
  let hashData = salt;

  sortedKeys.forEach(key => {
    const value = parameters[key];
    if (value) {
      hashData += `|${value.trim()}`;
    }
  });

  return createHash(hashingMethod).update(hashData).digest("hex").toUpperCase();
}

// Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

export async function createPaymentLinkViaRazorpay(details) {
  try {
    const txId = generateTransactionId();
    const currentTime = new Date();
    const expiryTime = new Date(currentTime.getTime() + 15 * 60 * 1000);
    const istUnixTimestamp = Math.floor(expiryTime.getTime() / 1000);

    const response = await razorpay.paymentLink.create({
      amount: Number(details.amount) * 100,
      currency: "INR",
      accept_partial: true,
      first_min_partial_amount: 100,
      expire_by: istUnixTimestamp,
      reference_id: txId,
      customer: {
        name: details.customer_name,
        email: details.customer_emailId,
        contact: details.customer_phone
      },
      notify: {
        sms: true,
        email: true
      },
      options: {
        checkout: {
          name: "GSX Solutions",
          theme: { hide_topbar: true },
          method: {
            netbanking: "1",
            card: "1",
            upi: "1",
            wallet: "1"
          }
        }
      }
    });

    if (!response) throw new Error("Unable to generate payment link");
    return responseMappingWithData(200, "Payment link created successfully", response);
  } catch (error) {
    console.error("Error in createPaymentLinkViaRazorpay:", error);
    return responseMappingError(500, "Internal server error", "Unable to create payment link");
  }
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

export async function createRazorpayPayoutService(details, type) {
  try {
    const referenceId = generateTransactionId();
    const contactId = await createRazorpayContact(details);

    let payoutData;
    if (type === "vpa") {
      const fundAccountId = await createRazorpayFundAccountForVpa(details, contactId);
      payoutData = await createPayout(fundAccountId, details.amount, "UPI",referenceId);
    } else if (type === "bank") {
      const fundAccountId = await createRazorpayFundAccountForBank(details, contactId);
      payoutData = await createPayout(fundAccountId, details.amount, "IMPS",referenceId);
    }

    return responseMappingWithData(200, "Payout created successfully", payoutData);
  } catch (error) {
    console.error("Error in createRazorpayPayoutService:", error);
    return responseMappingError(500, "Internal server error", "Unable to create payout");
  }
}

async function createRazorpayContact(details) {
  const requestBody = {
    name: details.account_name,
    email: details.customer_email,
    contact: details.customer_phone,
    type: "employee"
  };

  try {
    const response = await razorpay.contacts.create(requestBody);
    return response.id;
  } catch (error) {
    console.error("Error in createRazorpayContact:", error);
    throw new Error("Unable to create contact");
  }
}

async function createRazorpayFundAccountForBank(details, contactId) {
  const requestBody = {
    contact_id: contactId,
    account_type: "bank_account",
    bank_account: {
      name: details.account_name,
      ifsc: details.bank_ifsc,
      account_number: details.account_number
    }
  };

  try {
    const response = await razorpay.fundAccounts.create(requestBody);
    return response.id;
  } catch (error) {
    console.error("Error in createRazorpayFundAccountForBank:", error);
    throw new Error("Unable to create fund account");
  }
}

async function createRazorpayFundAccountForVpa(details, contactId) {
  const requestBody = {
    contact_id: contactId,
    account_type: "vpa",
    vpa: { address: details.customer_upiId }
  };

  try {
    const response = await razorpay.fundAccounts.create(requestBody);
    return response.id;
  } catch (error) {
    console.error("Error in createRazorpayFundAccountForVpa:", error);
    throw new Error("Unable to create VPA fund account");
  }
}

async function createPayout(fundAccountId, amount, mode,reference_id) {
  const payoutData = {
    account_number: process.env.RAZORPAY_ACCOUNT_ID,
    fund_account_id: fundAccountId,
    amount: amount * 100,
    currency: "INR",
    mode: mode,
    purpose: "payout",
    reference_id: `${reference_id}`
  };

  try {
    const response = await razorpay.payouts.create(payoutData);
    return response;
  } catch (error) {
    console.error("Error in createPayout:", error);
    throw new Error("Unable to create payout");
  }
}
