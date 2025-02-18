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
  

export async function validateBankAccount(account_number,ifsc)
{
  console.log(account_number,ifsc)
    try {
       const id = generateTransactionId()
        const response = await axios.post(
          `https://in.decentro.tech/core_banking/money_transfer/validate_account`,
          {
            
                "reference_id": `${id}`,
                "purpose_message": "This is a penny less transaction",
                "validation_type":"penniless",
                "beneficiary_details": {
                    "account_number": `${account_number}`,
                    "ifsc": `${ifsc}`
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
        console.log('response',response?.data)
    
        return { success: true, data: response?.data};
      } catch (error) {
        return {
          success: false,
          status: error.response?.status,
          error: error.response?.data || "Internal Server Error",
        };
      }
}


/*
{
  status: 'success',
  decentroTxnId: 'C7AB7015ACDE471D93EC63E4CF735ADC',
  accountStatus: 'valid',
  responseCode: 'S00000',
  message: 'The account has been successfully verified.',
  beneficiaryName: 'Mr. TUSHANT  CHAKRABORTY',
  bankReferenceNumber: '504910414996',
  validationType: 'penniless',
  transactionStatus: 'success'
}

{
      status: 'failure',
      decentroTxnId: 'AF577DE1698345AA8A65C47FF98BBA81',
      accountStatus: 'invalid',
      responseCode: 'E00000',
      message: 'This account number is invalid. Please check and try again.',
      providerMessage: 'NPCIERROR:INVALID ACCOUNT',
      bankReferenceNumber: '504910425731',
      validationType: 'penniless',
      transactionStatus: 'failure'
    }
  */


