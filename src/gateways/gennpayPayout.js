import CryptoJS from "crypto-js";
import { createHash } from 'crypto';
import { responseMappingError, responseMappingWithData } from "../utils/responseMapper";

// Function to generate hash (implement according to the document's specifications)
function generateHash(apiKey, merchantRefNum, amount, accountNumber, ifscCode, transferType) {
  // Placeholder: replace with actual hash generation logic
  // Usually, you would concatenate your fields with a secret salt (provided during onboarding) and hash it
  const salt = "65a3a0534791f366063280eafb5adf4a3d7158a7";  // The salt should be securely stored and retrieved
  const dataString = `${salt}|${apiKey}|${merchantRefNum}|${amount}|${accountNumber}|${ifscCode}|${transferType}`;
  return CryptoJS.SHA512(dataString).toString(CryptoJS.enc.Hex).toUpperCase();
}

function generateHashKey(parameters, salt, hashingMethod = 'sha512') {
  // Sort parameters by keys
  const sortedKeys = Object.keys(parameters).sort();
  let hashData = salt;
  console.log(sortedKeys)

  sortedKeys.forEach(key => {
      const value = parameters[key];
      if (value) {  // Only include non-empty values
          hashData += `|${value.trim()}`;
      }
  });

  // Generate hash
  const hash = createHash(hashingMethod).update(hashData).digest('hex').toUpperCase();
  return hash;
}
// Function to make the API request
export async function sendFundTransferRequest(apiKey, merchantRefNum, amount, accountNumber, ifscCode, transferType, optionalParams = {}) {
  const url = 'https://pgbiz.gennpay.com/v3/fundtransfer';

  const parameters = {
    api_key: apiKey,
    merchant_reference_number: merchantRefNum,
    amount: amount,
    account_number: accountNumber,
    ifsc_code: ifscCode,
    transfer_type: transferType,
    account_name:optionalParams.accountName,
    bank_name:optionalParams.bankName,
    // bank_branch:optionalParams.bankBranch
};

console.log('params', parameters)
  // Generate hash
  const hash = generateHash(apiKey, merchantRefNum, amount, accountNumber, ifscCode, transferType);
  const salt = process.env.GENNPAYSALTKEY;  // The salt should be securely stored and retrieved


  const hashed = generateHashKey(parameters,salt)




  // Create form data
  let formData = new FormData();
  formData.append("api_key", apiKey);
  formData.append("merchant_reference_number", merchantRefNum);
  formData.append("amount", amount);
  formData.append("account_number", accountNumber);
  formData.append("ifsc_code", ifscCode);
  formData.append("transfer_type", transferType);
  formData.append("hash", hashed);

  // Append optional parameters if provided
  if (optionalParams.accountName) formData.append("account_name", optionalParams.accountName);
  if (optionalParams.bankName) formData.append("bank_name", optionalParams.bankName);
  if (optionalParams.bankBranch) formData.append("bank_branch", optionalParams.bankBranch);

  // Send the request
  try {
      const response = await fetch(url, {
          method: 'POST',
          body: formData
      });
      const data = await response.json();
      console.log("API Response:", data);
      if(data.data.status=="SUCCESS")
      {

        return responseMappingWithData(
          200,
          "success",
          {message:"Payment request submitted",transaction_id:data.data.merchant_reference_number}
          );
        }else{
          return responseMappingError(
            500,
            "Internal server error",
            "Unable to process transaction at the moment"
          );
        }
     
  } catch (error) {
      console.error("Failed to send fund transfer request:", error);
      return responseMappingError(
        500,
        "Internal server error",
        "Unable to process transaction at the moment"
      );
  }
}

// Example usage
