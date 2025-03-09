import {
  TronWeb,
  utils as TronWebUtils,
  Trx,
  TransactionBuilder,
  Contract,
  Event,
  Plugin,
} from "tronweb";

export const walletAddress = process.env.walletAddress;
export const tronWeb = new TronWeb({
  fullHost: "https://api.trongrid.io", // Mainnet or https://nile.trongrid.io for testnet
  privateKey: process.env.privateKeyWallet, // Private key of the wallet to receive the payment
});
import Web3 from "web3";
import axios from "axios";
const USDTaddress = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t";

// Function to get or mint USDT (if the contract supports minting)
export async function getUSDT() {
  try {
    // Load the USDT contract
    const contract = await tronWeb.contract().at(usdtContractAddress);

    // Check if minting method is available on the contract
    if (contract.methods.mint) {
      // Mint 100 USDT (in its smallest unit, which is 6 decimals)
      const amountToMint = tronWeb.toSun(100); // 100 USDT in smallest unit (like wei in Ethereum)

      const transaction = await contract.methods
        .mint(tronWeb.defaultAddress.base58, amountToMint)
        .send({
          from: tronWeb.defaultAddress.base58,
        });

      console.log("Mint transaction:", transaction);
    } else {
      console.log("Minting method is not available on the USDT contract.");
    }
  } catch (error) {
    console.error("Error during USDT transaction:", error);
  }
}

// Function to transfer JST tokens and confirm status
export async function transferUSDT(receiverAddress, amount) {
  try {
    // Load the JST contract
    const contract = await tronWeb.contract().at(USDTaddress);

    // Convert the amount to the smallest unit (JST uses 6 decimals)
    // const amountInSun = tronWeb.toSun(amount);
    console.log("amount check sun", amount);
    // Initiate the transfer and get the transaction hash
    const txHash = await contract.methods
      .transfer(receiverAddress, amount)
      .send({
        from: tronWeb.defaultAddress.base58,
      });

    console.log("Transaction initiated. TxHash:", txHash);

    // Now check the transaction status using the txHash
    // Now check the transaction status using the txHash
    const confirmation = await checkTransactionStatus(txHash);

    if (confirmation.status === "success") {
      const actualAmount = confirmation.amount;
      return {
        txHash: txHash,
        amount: actualAmount, // Return the actual amount transferred
        status: "success",
      };
    } else {
      return {
        txHash: txHash,
        amount: amount,
        status: "failed",
      };
    }
  } catch (error) {
    console.error("Error during transaction:", error);

    return {
      txHash: null,
      amount: amount,
      status: "failed",
    };
  }
}

// Function to check the status of the transaction and retrieve the amount
async function checkTransactionStatus(txHash) {
  try {
    let receipt;
    // Wait for the transaction to be confirmed
    for (let i = 0; i < 10; i++) {
      // Retry up to 10 times
      receipt = await tronWeb.trx.getTransaction(txHash);

      // Check for the "ret" array and look for "contractRet" status
      if (receipt && receipt.ret && receipt.ret[0].contractRet === "SUCCESS") {
        //console.log('Transaction confirmed:', receipt);

        // Extract the actual amount transferred from the raw data
        const rawData = receipt.raw_data.contract[0].parameter.value.data;
        const transferredAmountHex = rawData.substring(rawData.length - 16);
        const transferredAmount = tronWeb.toDecimal(
          "0x" + transferredAmountHex
        );

        // Convert the amount back to the normal unit (divide by 10^6 for JST decimals)
        const actualAmount = tronWeb.fromSun(transferredAmount);

        return { status: "success", amount: actualAmount };
      }

      // Wait for a second before trying again
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    console.log("Transaction not confirmed yet.");
    return { status: "failed", amount: null };
  } catch (error) {
    console.error("Error checking transaction status:", error);
    return { status: "failed", amount: null };
  }
}

export async function getRecipientAddress(txHash) {
  try {
    // Fetch the transaction info from the blockchain
    const transactionInfo = await tronWeb.trx.getTransaction(txHash);

    // Check if the transaction was successful
    if (
      !transactionInfo.ret ||
      transactionInfo.ret[0].contractRet !== "SUCCESS"
    ) {
      console.log("Transaction was not successful.");
      return;
    }

    // Get the raw data from the contract
    const contractData = transactionInfo.raw_data.contract[0].parameter.value.data;

    // Check if the data exists and has enough length
    if (contractData && contractData.length >= 64) {
      // The recipient address is typically in the bytes 8 to 40 of the data (after the 4-byte function selector)
      const recipientAddressHex = contractData.substring(8, 72); // Get bytes 8 to 40 (padded address)
      
      console.log("Extracted Recipient Address Hex:", recipientAddressHex);

      // Convert the hex address to a base58 (TRON) address by prepending '41' to the hex address
      const recipientAddress = tronWeb.address.fromHex("41" + recipientAddressHex);

      console.log("Recipient Address in Base58:", recipientAddress);
      return recipientAddress; // Return the recipient address
    } else {
      console.log("Invalid data format or insufficient data length.");
    }
  } catch (error) {
    console.error("Error fetching or processing transaction:", error);
  }
}

export async function getRecipientAddressWeb3(txHash) {
  const web3 = new Web3("https://api.trongrid.io"); // Replace with your own provider if needed

  //const txHash = "yourTransactionHash"; // Replace with the actual transaction hash
  const contractAddress = USDTaddress; // TRC-20 contract address (USDT for example)

  // Define the Transfer event signature (ERC-20 / TRC-20 Transfer(address,address,uint256))
  const transferEventSignature = web3.utils.keccak256(
    "Transfer(address,address,uint256)"
  );

  // Fetch logs related to the transaction (from the TRC-20 contract)
  web3.eth
    .getTransactionReceipt(txHash)
    .then((receipt) => {
      if (receipt && receipt.logs && receipt.logs.length > 0) {
        receipt.logs.forEach((log) => {
          // Check if the log corresponds to a Transfer event (based on event signature)
          if (log.topics && log.topics[0] === transferEventSignature) {
            // Extract recipient address from the second topic
            const recipientAddressHex = log.topics[2];
            const recipientAddress = web3.utils.toChecksumAddress(
              "0x" + recipientAddressHex.substring(26)
            ); // Convert to Ethereum address format

            console.log("Recipient Address: ", recipientAddress);

            // Optionally, you can also extract the amount from the data field
            const amountHex = log.data.substring(0, 66); // The first 32 bytes of the data (amount)
            const amount = web3.utils.toBN(amountHex).toString(); // Convert amount to a readable value
            console.log("Transferred Amount: ", amount);
          }
        });
      } else {
        console.log("No logs found for this transaction.");
      }
    })
    .catch((err) => {
      console.log("Error fetching transaction receipt:", err);
    });
}
const apiKey = process.env.tronscanApiKey;

// Function to fetch the recipient address using Tronscan API
export async function getRecipientAddressUsingTronscan(txHash) {
  try {
    // Make a request to Tronscan API to get the transaction details
    const response = await axios.get(`https://api.tronscan.org/api/transaction-info?hash=${txHash}`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      }
    });
    // Check if the response data exists and parse it
    const transactionData = response?.data; // Ensure we access the correct path

    if (transactionData) {
      // Check if tokenTransferInfo exists and has data
      const tokenTransferInfo = transactionData.tokenTransferInfo;

      if (tokenTransferInfo) {
        // Extract recipient address (the "to_address")
        const recipientAddress = tokenTransferInfo.to_address;
        console.log("Recipient Address in Base58:", recipientAddress);
        return recipientAddress; // Return the recipient address
      } else {
        console.log("No token transfer info found in the transaction.");
        return null;
      }
    } else {
      console.log("No transaction data found in the response.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching transaction data from Tronscan:", error);
    return null;
  }
}