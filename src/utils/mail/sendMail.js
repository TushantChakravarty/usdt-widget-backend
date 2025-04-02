import nodemailer from "nodemailer";

import { emailTemplates } from "../../constants/template.constants";



export async function sendMail(email,subject,templateName,data){
    try{
        const transporter = nodemailer.createTransport({
            host: "mail.privateemail.com",
            port: 587, // Use 465 for secure connection
            secure: false, // Set to true if using port 465
            auth: {
              user: process.env.SENDER_EMAIL,
              pass: process.env.SENDER_EMAIL_PASSWORD,
            },
            tls: {
              rejectUnauthorized: false, // Helps with self-signed certificates
            },
          });

          let html = emailTemplates[templateName];
        if (!html) throw new Error('Template not found');

        // Replace placeholders with actual data
        html = html.replace(/\{\{(.*?)\}\}/g, (_, key) => data[key.trim()] || '');

          const mailOptions = {
            from: {
              name: "USDT MARKETPLACE",
              address: process.env.SENDER_EMAIL,
            },
            to: email,
            subject: subject,
            html: html,
          };
          await transporter.sendMail(mailOptions);
          return true


    }catch(error){
        console.log(`sendMail.${error.message}`)
        return false
    }
}


export async function sendMailSupport(email,subject,templateName,data){
  try{
      const transporter = nodemailer.createTransport({
          host: "mail.privateemail.com",
          port: 587, // Use 465 for secure connection
          secure: false, // Set to true if using port 465
          auth: {
            user: process.env.SENDER_EMAIL,
            pass: process.env.SENDER_EMAIL_PASSWORD,
          },
          tls: {
            rejectUnauthorized: false, // Helps with self-signed certificates
          },
        });

        let html = emailTemplates[templateName];
      if (!html) throw new Error('Template not found');

      // Replace placeholders with actual data
      html = html.replace(/\{\{(.*?)\}\}/g, (_, key) => data[key.trim()] || '');

        const mailOptions = {
          from: {
            name: "USDT MARKETPLACE",
            address: process.env.SENDER_EMAIL,
          },
          to: email,
          subject: subject,
          html: html,
        };
        await transporter.sendMail(mailOptions);
        return true


  }catch(error){
      console.log(`sendMail.${error.message}`)
      return false
  }
}



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
  const template = `<div style="font-family: Figtree, sans-serif; margin: 0; padding: 0;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" align="center" style="max-width: 600px; background-color: #ffffff !important; border-radius: 12px; box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1); text-align: center; border: 1px solid #ddd;" bgcolor="#ffffff">
    
    <tr>
      <td style="background-image: url('https://res.cloudinary.com/dbr9mrvja/image/upload/v1742885141/ocxzjfcdcecgxgmlvcvm.jpg'); background-size: cover; background-position: center;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
          <tr>
            <td align="center" style="background-color: rgba(0, 0, 0, 0.6) !important; padding: 15px; backdrop-filter: blur(10px) !important;">
              <img src="https://res.cloudinary.com/dbr9mrvja/image/upload/v1742885169/eygnaio0rgsjsxkjxbcx.jpg" alt="USDT Logo" width="30" height="30" style="border-radius: 8px; vertical-align: middle;">
              <h2 style="display: inline-block; margin: 0; font-size: 18px; color: white !important;">USDT Marketplace</h2>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    
    <tr>
      <td style="padding: 15px; text-align: center;">
        <h3 style="color: #E10E0E !important; font-size: 16px; font-weight: 700; margin: 10px 0;">Transaction Failed 👎</h3>
        <p style="color: #555 !important; font-size: 14px; margin: 5px 0;">Your recent transaction could not be processed.</p>
      </td>
    </tr>

    <tr>
      <td style="background-color: #fce4e4 !important; padding: 12px; border-radius: 8px; text-align: left;" bgcolor="#fce4e4">
        <h4 style="text-align: center; font-size: 16px; font-weight: bold; margin: 10px 0;">Transaction Details</h4>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="5" border="0" style="font-size: 14px; color: #555 !important;">
          <tr><td><b>Transaction ID:</b></td><td>${transactionId}</td></tr>
          <tr><td><b>Amount Paid:</b></td><td>${amount} ${localCurrency}</td></tr>
          <tr><td><b>Crypto Attempted:</b></td><td>${cryptoAmount} USDT</td></tr>
          <tr><td><b>Blockchain:</b></td><td>${cryptoType}</td></tr>
          <tr><td><b>Transaction Hash:</b></td><td>${hash}</td></tr>
          <tr><td><b>Status:</b></td><td><b>Failed</b></td></tr>
        </table>
      </td>
    </tr>

    <tr>
      <td style="padding: 15px; text-align: left;">
        <p style="font-size: 16px; font-weight: 600; margin: 5px 0;">Need help?</p>
        <p style="color: #00000099 !important; margin: 5px 0;">
          If you have any questions or need assistance, reach out
          <a href="mailto:support@usdtmarketplace.com" style="color: #007bff !important; text-decoration: none;">support@usdtmarketplace.com</a>.
        </p>
        <p style="color: #00000099 !important; font-weight: 500; margin: 5px 0;">Thank you for choosing <b>USDT Marketplace!</b> 🚀</p>
      </td>
    </tr>
  </table>
</div>

<style>
  @media (prefers-color-scheme: dark) {
    body, table {
      background-color: #ffffff !important;
      color: #000000 !important;
    }
    a {
      color: #007bff !important;
    }
  }
</style> `
    const mailOptions = {
      from: {
        name: "GSX solutions",
        address: "support@usdtmarketplace.com",
      },
      to: email,
      subject: "Failed Transaction Alert",
      text: `Your transaction could not be completed.`,
      html: template,
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

  const template = `<div style="font-family: Figtree, sans-serif; margin: 0; padding: 0;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" align="center" style="max-width: 600px; background-color: #ffffff !important; border-radius: 12px; box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1); text-align: center; border: 1px solid #ddd;" bgcolor="#ffffff">
        
        <tr>
          <td style="background-image: url('https://res.cloudinary.com/dbr9mrvja/image/upload/v1742885141/ocxzjfcdcecgxgmlvcvm.jpg'); background-size: cover; background-position: center;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
              <tr>
                <td align="center" style="background-color: rgba(0, 0, 0, 0.6) !important; padding: 15px; backdrop-filter: blur(10px) !important;">
                  <img src="https://res.cloudinary.com/dbr9mrvja/image/upload/v1742885169/eygnaio0rgsjsxkjxbcx.jpg" alt="USDT Logo" width="30" height="30" style="border-radius: 8px; vertical-align: middle;">
                  <h2 style="display: inline-block; margin: 0; font-size: 18px; color: white !important;">USDT Marketplace</h2>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        
        <tr>
          <td style="padding: 15px; text-align: center;">
            <h3 style="color: #6BA401 !important; font-size: 16px; font-weight: 700; margin: 10px 0;">Transaction Successfully Processed 🎉</h3>
            <p style="color: #555 !important; font-size: 14px; margin: 5px 0;">Your recent transaction has been completed successfully.</p>
          </td>
        </tr>

        <tr>
          <td style="background-color: #f3f8e9 !important; padding: 12px; border-radius: 8px; text-align: left;" bgcolor="#f3f8e9">
            <h4 style="text-align: center; font-size: 16px; font-weight: bold; margin: 10px 0;">Transaction Details</h4>
            <table role="presentation" width="100%" cellspacing="0" cellpadding="5" border="0" style="font-size: 14px; color: #555 !important;">
              <tr><td><b>Transaction ID:</b></td><td>${transactionId}</td></tr>
              <tr><td><b>Amount Paid:</b></td><td>${amount} ${localCurrency}</td></tr>
              <tr><td><b>Crypto Received:</b></td><td>${cryptoAmount} USDT</td></tr>
              <tr><td><b>Blockchain:</b></td><td>${cryptoType}</td></tr>
              <tr><td><b>Transaction Hash:</b></td><td>${hash}</td></tr>
              <tr><td><b>Status:</b></td><td><b>Successful 🎉</b></td></tr>
            </table>
          </td>
        </tr>

        <tr>
          <td style="padding: 15px; text-align: left;">
            <p style="font-size: 16px; font-weight: 600; margin: 5px 0;">Need help?</p>
            <p style="color: #00000099 !important; margin: 5px 0;">
              If you have any questions or need assistance, reach out
              <a href="mailto:support@usdtmarketplace.com" style="color: #007bff !important; text-decoration: none;">support@usdtmarketplace.com</a>.
            </p>
            <p style="color: #00000099 !important; font-weight: 500; margin: 5px 0;">Thank you for choosing <b>USDT Marketplace!</b> 🚀</p>
          </td>
        </tr>
      </table>
    </div>

    <style>
      @media (prefers-color-scheme: dark) {
        body, table {
          background-color: #ffffff !important;
          color: #000000 !important;
        }
        a {
          color: #007bff !important;
        }
      }
    </style>`
    const mailOptions = {
      from: {
        name: "GSX solutions",
        address: "tshubhanshu007@gmail.com",
      },
      to: email,
      subject: "Confirmation: Successful Offramp Transaction",
text: `Successful Offramp Transaction`,
html: template,
};
await transporter.sendMail(mailOptions);
  }catch(error){
    console.log("send failed transaction mail error",error.message)
  }
}