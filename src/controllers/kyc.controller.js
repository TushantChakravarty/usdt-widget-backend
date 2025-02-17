import fetch from "node-fetch";
import { generateTransactionIdGateway } from "../utils/utils";
import db from "../models/index.js";
import { createNewRecord, findOneAndUpdate, findRecord, findRecordNew } from "../Dao/dao.js";
import {
  responseMappingError,
  responseMappingWithData,
} from "../utils/responseMapper.js";
const { Kyc, User } = db;

const DECENTRO_BASE_URL = process.env.DECENTRO_BASE_URL;
const CLIENT_ID = process.env.DECENTRO_CLIENT_ID;
const API_KEY = process.env.DECENTRO_CLIENT_SECRET;
const module_secret = process.env.DECENTRO_MODULE_SECRET;
/**
 * Generate OTP for Aadhaar Verification
 * @param {string} referenceId - Unique transaction ID
 * @param {string} aadhaarNumber - User's Aadhaar number
 * @returns {Promise<Object>} - API Response
 */
export const generateAadhaarOTP = async (referenceId, aadhaarNumber) => {
  const url = `${DECENTRO_BASE_URL}/kyc/aadhaar/otp`;
  const headers = {
    "Content-Type": "application/json",
    client_id: CLIENT_ID,
    client_secret: API_KEY,
    module_secret: module_secret,
  };
  const body = JSON.stringify({
    reference_id: referenceId,
    consent: true,
    purpose: "For Aadhaar Verification",
    aadhaar_number: aadhaarNumber,
  });

  try {
    const response = await fetch(url, { method: "POST", headers, body });
    const respJson = await response.json();
    console.log("otp check", respJson);
    // if(respJson?.status=="SUCCESS")
    // {

    return respJson;
    // }else{
    //     return {
    //         "decentroTxnId": "98293839933",
    //         "status": "SUCCESS",
    //         "responseCode": "S00000",
    //         "message": "OTP generated and sent successfully on the registered mobile number. Kindly trigger the Validate OTP API within the next 10 minutes.",
    //         "data": {
    //             "last3DigitsOfLinkedMobileNumber": "*******982"
    //         },
    //         "responseKey": "success_otp_generated"
    //     }
    // }
  } catch (error) {
    // return {
    //     "decentroTxnId": "98293839933",
    //     "status": "SUCCESS",
    //     "responseCode": "S00000",
    //     "message": "OTP generated and sent successfully on the registered mobile number. Kindly trigger the Validate OTP API within the next 10 minutes.",
    //     "data": {
    //         "last3DigitsOfLinkedMobileNumber": "*******982"
    //     },
    //     "responseKey": "success_otp_generated"
    // }
    return { status: "ERROR", message: error.message };
  }
};

/**
 * Validate OTP for Aadhaar Verification
 * @param {string} referenceId - Unique transaction ID
 * @param {string} initiationTransactionId - Transaction ID from OTP generation response
 * @param {string} otp - OTP received on Aadhaar-linked mobile
 * @param {string} shareCode - 4-digit share code set by the user
 * @returns {Promise<Object>} - API Response
 */
export const validateAadhaarOTP = async (
  referenceId,
  initiationTransactionId,
  otp,
  shareCode
) => {
  const url = `${DECENTRO_BASE_URL}/kyc/aadhaar/otp/validate`;
  const headers = {
    "Content-Type": "application/json",
    client_id: CLIENT_ID,
    client_secret: API_KEY,
    module_secret: module_secret,
  };
  const body = JSON.stringify({
    reference_id: referenceId,
    consent: true,
    purpose: "For Aadhaar Verification",
    initiation_transaction_id: initiationTransactionId,
    otp,
    shareCode: shareCode || "1234", // Default share code if not provided
  });

  try {
    const response = await fetch(url, { method: "POST", headers, body });
    return await response.json();
  } catch (error) {
    return { status: "ERROR", message: error.message };
  }
};

export async function generateUserAadharOtp(request, reply) {
  const { aadharNumber } = request.body;
  if (request?.user?.isKycCompleted) {
    return reply
      .status(400)
      .send(responseMappingError(400, "User is already Kyc verified"));
  }
  try {
    const exists = await findRecordNew(Kyc, {
      aadhaarReferenceNumber: aadharNumber?.toString(),
    });
    console.log("exists",exists)
    if (exists?.userId !== request?.user?.id) {
      return reply
        .status(400)
        .send(
          responseMappingError(
            400,
            "Aadhar already belongs to another user"
          )
        );
    } 
    const referenceId = generateTransactionIdGateway(10);
    const response = await generateAadhaarOTP(
      referenceId?.toString(),
      aadharNumber?.toString()
    );
    if (response?.status == "SUCCESS") {
      const exists = await findRecordNew(Kyc, {
        aadhaarReferenceNumber: aadharNumber?.toString(),
      });
      console.log("existing check", exists);
      if (exists) {
        if (exists?.userId !== request?.user?.id) {
          return reply
            .status(400)
            .send(
              responseMappingError(
                400,
                "Aadhar already belongs to another user"
              )
            );
        } else {
          let updateDetails = {
            referenceID: referenceId,
            decentroTxnId: response?.decentroTxnId,
          };
          const updated = await findOneAndUpdate(
            Kyc,
            { aadhaarReferenceNumber: aadharNumber?.toString() },
            updateDetails
          ).catch((error) => {
            console.log(error);
            return reply
              .status(400)
              .send(
                responseMappingError(
                  500,
                  "Sorry unable to process aadhar kyc request at the moment please try later"
                )
              );
          });
          if (updated) {
            const responseMessage = `${response?.message}Last 3 digits of registered mobile number ${response?.data?.last3DigitsOfLinkedMobileNumber}`;
            return reply.status(200).send(
              responseMappingWithData(200, "success", {
                id: referenceId,
                message: responseMessage,
              })
            );
          } else {
            return reply
              .status(400)
              .send(
                responseMappingError(
                  500,
                  "Sorry unable to process aadhar kyc request at the moment please try later"
                )
              );
          }
        }
      } else {
        let updateDetails = {
          userId: request?.user?.id,
          referenceID: referenceId,
          decentroTxnId: response?.decentroTxnId,
          responseCode: response?.responseCode,
          message: response?.message,
          status: response?.status,
          aadhaarReferenceNumber: aadharNumber,
        };
        const updated = await createNewRecord(Kyc, updateDetails);

        if (updated) {
          const responseMessage = `${response?.message}Last 3 digits of registered mobile number ${response?.data?.last3DigitsOfLinkedMobileNumber}`;
          return reply.status(200).send(
            responseMappingWithData(200, "success", {
              id: referenceId,
              message: responseMessage,
            })
          );
        } else {
          return reply
            .status(500)
            .send(
              responseMappingError(
                500,
                "Sorry unable to process aadhar kyc request at the moment please try later"
              )
            );
        }
      }
    } else {
      return reply
        .status(500)
        .send(
          responseMappingError(
            500,
            "Sorry unable to process aadhar kyc request at the moment please try later"
          )
        );
    }
  } catch (error) {
    console.log(error);
    return reply
      .status(500)
      .send(
        responseMappingError(
          500,
          "Sorry unable to process aadhar kyc request at the moment please try later"
        )
      );
  }
}

export async function validateUserAadharOtp(request, reply) {
  console.log("body check", request.body);
  const { referenceId, otp } = request.body;
  if (request?.user?.isKycCompleted) {
    return reply
      .status(400)
      .send(responseMappingError(400, "User is already Kyc verified"));
  }
  try {
    const kycData = await findRecordNew(Kyc, {
      referenceID: referenceId,
    });
    if (kycData) {
      if (kycData?.userId !== request?.user?.id) {
        return reply
          .status(400)
          .send(responseMappingError(400, "Invalid kyc verification request"));
      }

      if (kycData?.completed) {
        return reply
          .status(400)
          .send(responseMappingError(400, "Kyc request already completed"));
      }

      const validateOtp = await validateAadhaarOTP(
        referenceId,
        kycData?.decentroTxnId,
        otp
      );
      console.log("validate check", validateOtp);
      if (validateOtp?.status == "SUCCESS") {
        let updateDetails = {
          aadharVerificationId: validateOtp?.data?.aadhaarReferenceNumber,
          proofOfIdentity:  validateOtp?.data?.proofOfIdentity,
          proofOfAddress:validateOtp?.data?.proofOfAddress,
          image:validateOtp?.data?.image,
          completed:true,
          decentroTxnId:validateOtp?.decentroTxnId
        };
        const updated = await findOneAndUpdate(Kyc,{ referenceID:referenceId}, updateDetails)
        const userUpdate = await findOneAndUpdate(User,{id:request?.user?.id}, {isKycCompleted:true})
        if(updated&&userUpdate)
        {
          return reply
          .status(200)
          .send(responseMappingWithData(200, "KYC completed successfully"));
        }else{
          return reply
          .status(500)
          .send(
            responseMappingError(
              500,
              "Sorry unable to process aadhar kyc request at the moment please try later"
            )
          );
        }

       
      } else {
        return reply
          .status(500)
          .send(
            responseMappingError(
              500,
              "Sorry unable to validate otp at the moment please try later"
            )
          );
      }
    } else {
      return reply
        .status(400)
        .send(responseMappingError(400, "Invalid kyc verification request"));
    }
  } catch (error) {
    console.log(error);
    return reply
      .status(500)
      .send(
        responseMappingError(
          500,
          "Sorry unable to process aadhar kyc request at the moment please try later"
        )
      );
  }
}
