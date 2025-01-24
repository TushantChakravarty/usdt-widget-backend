

import nodemailer from "nodemailer";

export async function sendMailForFailedPayment(transactionId,amount,localCurrency,cryptoAmount,cryptoType,hash,email){
  try{
const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "tshubhanshu007@gmail.com",
        pass: "wltf sfzq mlni tnhv",
      },
    });
    const otp = await generateOTP(email);
    console.log(otp);
    const mailOptions = {
      from: {
        name: "GSX solutions",
        address: "tshubhanshu007@gmail.com",
      },
      to: email,
      subject: "Action required: Failed Offramp Transaction",
      text: `Failed Offramp Transaction`,
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
        
        <h2 style="text-align: center; color: #007bff; border-bottom: 2px solid #007bff; padding-bottom: 10px;">USDT Marketplace</h2>
        
        <p style="font-size: 16px; line-height: 1.5;">Hello,</p>
        <p style="font-size: 16px; line-height: 1.5;">We regret to inform you that your recent offramp transaction could not be completed due to an issue with the bank.</p>

        <div style="background-color: #f1f1f1; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="font-size: 16px; color: #dc3545; font-weight: bold; margin: 0;">Transaction Details:</p>
            <p style="font-size: 16px; line-height: 1.5; margin-top: 10px;">Transaction ID: <strong>${transactionId}</strong></p>
            <p style="font-size: 16px; line-height: 1.5;">Amount: <strong>${amount} ${localCurrency}</strong></p>
            <p style="font-size: 16px; line-height: 1.5;">Crypto Amount: <strong>${cryptoAmount} ${cryptoType}</strong></p>
            <p style="font-size: 16px; line-height: 1.5;">Transaction Hash: <strong>${hash}</strong></p>
            <p style="font-size: 16px; line-height: 1.5;">Payment Status: <strong style="color: #dc3545;">Fail</strong></p>
        </div>

        <p style="font-size: 16px; line-height: 1.5;">To proceed, please follow these steps:</p>
        <ol style="font-size: 16px; line-height: 1.5; padding-left: 20px; margin-top: 0;">
            <li>Log in to your account.</li>
            <li>Go to the <strong>Transaction History</strong> page.</li>
            <li>Locate this transaction and click <strong>Retry</strong>.</li>
        </ol>

        <p style="font-size: 16px; line-height: 1.5;">If the issue persists, try a different bank or feel free to <a href="mailto:support@usdtmarketplace.com" style="color: #007bff; text-decoration: none;">contact our support team</a> for assistance.</p>

        <p style="font-size: 16px; line-height: 1.5;">Thank you for your patience and understanding.</p>
        <p style="font-size: 16px; line-height: 1.5;">Best regards,</p>
        <p style="font-size: 16px; line-height: 1.5;">The USDT Marketplace Team</p>

        <hr style="border: 0; height: 1px; background: #ddd; margin: 20px 0;">
        <small style="color: #666; font-size: 12px;">If you have any questions, feel free to reach out to us at <a href="mailto:support@usdtmarketplace.com" style="color: #007bff; text-decoration: none;">support@usdtmarketplace.com</a></small>
    </div>
</div>

      `,
    };
    await transporter.sendMail(mailOptions);
  }catch(error){
    console.log("send failed transaction mail error",error.message)
  }
}