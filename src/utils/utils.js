import { SocksProxyAgent } from "socks-proxy-agent";
import axios from "axios";

const proxyAgent = new SocksProxyAgent("socks5h://127.0.0.1:8080");

export function generateRandomFiatId() {
    return Math.floor(1000000000 + Math.random() * 9000000000);
}

export function generateRandomCustomerId() {
    return Math.floor(1000000000 + Math.random() * 9000000000);
}

export function generateTransactionId() {
    return Math.floor(1000000000 + Math.random() * 9000000000);
}

export function generateTransactionIdGateway(length) {
    //console.log('ran')
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let transactionId = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        transactionId += characters.charAt(randomIndex);
    }
   // console.log(transactionId)
    return transactionId;
  }
  

export async function validateBankAccount()
{
    try {
        const response = await axios.post(
          `https://in.decentro.tech/core_banking/money_transfer/validate_account`,
          {
            
                "reference_id": "1299998",
                "purpose_message": "This is a penny less transaction",
                "validation_type":"penniless",
                "beneficiary_details": {
                    "account_number": "20323508372",
                    "ifsc": "sbin0007258"
                }
            
          },
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              client_id:"gsx_prod",
              client_secret:"4K4ZbnvboUMQGoJAfuyd58e9r2bvlrnM",
              module_secret:"wHVo4jIJozopvZBfLHVUiRwCtOFx5ZlM",
              provider_secret:"b8A6yTxdrxd0Ays5LvoYbIwzj7fLnl3w"

            },
            httpAgent: proxyAgent, // <-- Add this
            httpsAgent: proxyAgent, // <-- Add this
          }
        );
        console.log('response',response)
    
        return { success: true, data: response};
      } catch (error) {
        return {
          success: false,
          status: error.response?.status,
          error: error.response?.data || "Internal Server Error",
        };
      }
}

(async () => {
  // Test sign-up
  //const response = await signUpUser(testUser);

  // Test sign-in
  // const response = await signInUser(testUser);
  // const response = await getCurrencies()
  // const response = await getRates()
  // const response = await sellMethods()
//   const response = await sellRates();
const response = await validateBankAccount()

  console.log(response);
})();
