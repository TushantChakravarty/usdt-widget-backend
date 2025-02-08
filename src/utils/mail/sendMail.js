import nodemailer from "nodemailer";

export async function sendMailForFailedPayment(transactionId,amount,localCurrency,cryptoAmount,cryptoType,hash,email){
  try{
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
      to: email,
      subject: "Failed Transaction Alert",
      text: `Your transaction could not be completed.`,
      html: `<div style='background-color:  #f1f1f1;'>
    <div style="background: #528ff0; height: 12vh; position: relative;">
        <div
            style="margin: auto; box-sizing: border-box; padding-top: 20px; text-align: center; width: fit-content; margin: 0 auto; font-size: 16px; line-height: 1.5;">
            <div
                style="display: inline-block; vertical-align: middle; margin-left: 10px; color: #ffffff; font-family: Trebuchet MS;">
                USDT Marketplace
            </div>
        </div>
    </div>
    <div
        style="max-width: 400px; margin: -50px auto 0; background-color: #fff;  box-shadow: 0 4px 8px rgba(0,0,0,0.1); position: relative; border-radius: 5px;">
        <h3 style="margin: 0; font-size: 16px; line-height: 1.5; text-align: center; color: #7b8199; padding: 20px;">
            Transaction Failed</h3>
        <hr style="border: 0; height: 1px; background: #ddd; margin: 0;">
        <p style="color: #7b8199; text-align: center; padding: 0 20px;">We could not complete your recent transaction.
            Please see the details below:</p>
        <hr style="border: 0; height: 10px; background:  #f1f1f1; margin: 10px 0;">
        <p style="font-size: 16px; font-weight: bold; margin: 0; text-align: center; color: #7b8199;">Transaction
            Details</p>
        <div
            style="background-color: #fff; padding: 20px; border-radius: 8px; margin: 10px 0; display: grid;;gap:20px; max-width: 400px;">
            <div
                style="color: #515978; display: grid; grid-template-columns: auto 1fr; align-items: center; gap: 22px;">
                <strong>Transaction ID:</strong> <span style="color: #515978;">${transactionId}</span></div>
            <div style="color: #515978;display: grid; grid-template-columns: auto 1fr; align-items: center; gap: 70px;">
                <strong>Amount:</strong> <span style="color: #515978;">${amount}
                    ${localCurrency}</span></div>
            <div
                style="color: #515978; display: grid; grid-template-columns: auto 1fr; align-items: center; gap: 18px;">
                <strong>Crypto Amount:</strong> <span style="color: #515978;">${cryptoAmount}
                    USDT</span></div>
            <div
                style="color: #515978; display: grid; grid-template-columns: auto 1fr; align-items: center; gap: 84px;">
                <strong>Chain:</strong><span>${cryptoType}</span></div>
            <div style="color: #515978; display: grid; grid-template-columns: auto 1fr; align-items: center; gap: 5px;">
                <strong>Transaction Hash:</strong> <span style="color: #515978;">${hash}</span></div>
            <div
                style="color: #515978;  display: grid; grid-template-columns: auto 1fr; align-items: center; gap: 84px;">
                <strong>Status:</strong> <span style="color: #515978;">Failed</span></div>
        </div>
        <hr style="border: 0; height: 10px; background:  #f1f1f1; margin: 10px 0;">
        <div style='padding: 0 20px;'>
            <p style="color: #7b8199;">Please log in to your account to retry the transaction. If the issue persists,
                contact support at <a href="mailto:support@usdtmarketplace.com"
                    style="color: #515978;">support@usdtmarketplace.com</a>.</p>
            <p style="color: #7b8199;">Thank you for your understanding.</p>
             <p style="color: #7b8199;">Best regards</p>
            <p style="color: #7b8199;">USDT Marketplace Team</p>
        </div>
        <hr style="border: 0; height: 1px; background: #ddd; margin: 20px 0;">
        <div style='padding-bottom: 20px; padding-left: 20px;'>
            <small style="color: #666; font-size: 12px; ">If you have any questions, feel free to reach out to us at
                <a href="mailto:support@usdtmarketplace.com"
                    style="color: #515978; text-decoration: none;">support@usdtmarketplace.com</a></small>
        </div>
    </div>
</div>
      `,
    };
    await transporter.sendMail(mailOptions);
  }catch(error){
    console.log("send failed transaction mail error",error.message)
  }
}



export async function sendMailForSuccessPayment(transactionId,amount,localCurrency,cryptoAmount,cryptoType,hash,email){
  try{
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
        address: "tshubhanshu007@gmail.com",
      },
      to: email,
      subject: "Confirmation: Successful Offramp Transaction",
text: `Successful Offramp Transaction`,
html: `
<div style='background-color:  #f1f1f1;'>
    <div style="background: #528ff0; height: 12vh; position: relative;">
        <div
            style="margin: auto; box-sizing: border-box; padding-top: 20px; text-align: center; width: fit-content; margin: 0 auto; font-size: 16px; line-height: 1.5;">
            <div
                style="display: inline-block; vertical-align: middle; margin-left: 10px; color: #ffffff; font-family: Trebuchet MS;">
                USDT Marketplace
            </div>
        </div>
    </div>
    <div
        style="max-width: 400px; margin: -50px auto 0; background-color: #fff;  box-shadow: 0 4px 8px rgba(0,0,0,0.1); position: relative; border-radius: 5px;">
        <h3 style="margin: 0; font-size: 16px; line-height: 1.5; text-align: center; color: #7b8199; padding: 20px;">
            Transaction Successfully</h3>
        <hr style="border: 0; height: 1px; background: #ddd; margin: 0;">
        <p style="color: #7b8199; text-align: center; padding: 0 20px;">Your recent transaction has been successfully
            processed.</p>
        <hr style="border: 0; height: 10px; background:  #f1f1f1; margin: 10px 0;">
        <p style="font-size: 16px; font-weight: bold; margin: 0; text-align: center; color: #7b8199;">Transaction
            Details</p>
        <div
            style="background-color: #fff; padding: 20px; border-radius: 8px; margin: 10px 0; display: grid;;gap:20px; max-width: 400px;">
            <div
                style="color: #515978; display: grid; grid-template-columns: auto 1fr; align-items: center; gap: 22px;">
                <strong>Transaction ID:</strong> <span style="color: #515978;">${transactionId}</span>
            </div>
            <div style="color: #515978;display: grid; grid-template-columns: auto 1fr; align-items: center; gap: 70px;">
                <strong>Amount:</strong> <span style="color: #515978;">${amount}
                    ${localCurrency}</span>
            </div>
            <div
                style="color: #515978; display: grid; grid-template-columns: auto 1fr; align-items: center; gap: 18px;">
                <strong>Crypto Amount:</strong> <span style="color: #515978;">${cryptoAmount}
                    USDT</span>
            </div>
            <div
                style="color: #515978; display: grid; grid-template-columns: auto 1fr; align-items: center; gap: 84px;">
                <strong>Chain:</strong><span>${cryptoType}</span>
            </div>
            <div style="color: #515978; display: grid; grid-template-columns: auto 1fr; align-items: center; gap: 5px;">
                <strong>Transaction Hash:</strong> <span style="color: #515978;">${hash}</span>
            </div>
            <div
                style="color: #515978;  display: grid; grid-template-columns: auto 1fr; align-items: center; gap: 84px;">
                <strong>Status:</strong> <span style="color: #515978;">Successful</span>
            </div>
        </div>
        <hr style="border: 0; height: 10px; background:  #f1f1f1; margin: 10px 0;">
        <div style='padding: 0 20px;'>

            <p style="color: #7b8199;">Thank you for choosing USDT Marketplace. If you have any questions, feel free to
                reach out to us. <a href="mailto:support@usdtmarketplace.com"
                    style="color: #515978;">support@usdtmarketplace.com</a>.</p>
            <p style="color: #7b8199;">Best regards</p>
            <p style="color: #7b8199;">USDT Marketplace Team</p>
        </div>
        <hr style="border: 0; height: 1px; background: #ddd; margin: 20px 0;">
        <div style='padding-bottom: 20px; padding-left: 20px;'>

            <small style="color: #666; font-size: 12px; ">If you have any questions, feel free to reach out to us at
                <a href="mailto:support@usdtmarketplace.com"
                    style="color: #515978; text-decoration: none;">support@usdtmarketplace.com</a></small>
        </div>
    </div>
</div>
`,
};
await transporter.sendMail(mailOptions);
  }catch(error){
    console.log("send failed transaction mail error",error.message)
  }
}