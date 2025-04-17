export const emailTemplates = {
  welcome: `
      <h2>Welcome, {{ name }}!</h2>
      <p>We are glad to have you at {{ company }}.</p>
      <p>Please verify your email by clicking <a href="{{ link }}">here</a>.</p>
      <p>Best Regards,<br>Team {{ company }}</p>
  `,
  resetPassword: `
      <h2>Hello, {{ name }}!</h2>
      <p>You requested a password reset.</p>
      <p>Click <a href="{{ resetLink }}">here</a> to reset your password.</p>
      <p>If you didn't request this, please ignore this email.</p>
  `,

  // loginOtp: `
  //  <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; color: #333;">
  //         <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
            
  //           <h2 style="text-align: center; color: #007bff; border-bottom: 2px solid #007bff; padding-bottom: 10px;">USDT Marketplace</h2>
            
  //           <p style="font-size: 16px; line-height: 1.5;">Hello,</p>
  //           <p style="font-size: 16px; line-height: 1.5;">Your One-Time Password (OTP) for Login in USDT Marketplace is:</p>
    
  //           <div style="text-align: center; padding: 20px; margin: 20px 0; background-color: #f1f1f1; border-radius: 8px;">
  //             <p style="font-size: 36px; font-weight: bold; color: #007bff; margin: 0;">{{otp}}</p>
  //           </div>
    
  //           <p style="font-size: 16px; line-height: 1.5;">Please enter this OTP to complete your login process. This OTP is valid for <strong>10 minutes</strong>.</p>
    
  //           <div style="background-color: #007bff; color: white; padding: 10px; border-radius: 8px; text-align: center; margin: 20px 0;">
  //             <p>If you did not request this OTP, please <a href="mailto:support@usdtmarketplace.com" style="color: white; text-decoration: underline;">contact our support team</a> immediately.</p>
  //           </div>
    
  //           <p style="font-size: 16px; line-height: 1.5;">Thank you,</p>
  //           <p style="font-size: 16px; line-height: 1.5;">The USDT Marketplace Team</p>
    
  //           <hr style="border: 0; height: 1px; background: #ddd; margin: 20px 0;">
  //           <small style="color: #666; font-size: 12px;">If you have any questions, feel free to reach out to us at <a href="mailto:support@usdtmarketplace.com" style="color: #007bff; text-decoration: none;">support@usdtmarketplace.com</a></small>
  //         </div>
  //       </div>
  // `,
  // signUpOtp:`
  // <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; color: #333;">
  //         <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
            
  //           <h2 style="text-align: center; color: #007bff; border-bottom: 2px solid #007bff; padding-bottom: 10px;">USDT Marketplace</h2>
            
  //           <p style="font-size: 16px; line-height: 1.5;">Hello,</p>
  //           <p style="font-size: 16px; line-height: 1.5;">Your One-Time Password (OTP) for Sign up in USDT Marketplace is:</p>
    
  //           <div style="text-align: center; padding: 20px; margin: 20px 0; background-color: #f1f1f1; border-radius: 8px;">
  //             <p style="font-size: 36px; font-weight: bold; color: #007bff; margin: 0;">{{otp}}</p>
  //           </div>
    
  //           <p style="font-size: 16px; line-height: 1.5;">Please enter this OTP to complete your sign up process. This OTP is valid for <strong>10 minutes</strong>.</p>
    
  //           <div style="background-color: #007bff; color: white; padding: 10px; border-radius: 8px; text-align: center; margin: 20px 0;">
  //             <p>If you did not request this OTP, please <a href="mailto:support@usdtmarketplace.com" style="color: white; text-decoration: underline;">contact our support team</a> immediately.</p>
  //           </div>
    
  //           <p style="font-size: 16px; line-height: 1.5;">Thank you,</p>
  //           <p style="font-size: 16px; line-height: 1.5;">The USDT Marketplace Team</p>
    
  //           <hr style="border: 0; height: 1px; background: #ddd; margin: 20px 0;">
  //           <small style="color: #666; font-size: 12px;">If you have any questions, feel free to reach out to us at <a href="mailto:support@usdtmarketplace.com" style="color: #007bff; text-decoration: none;">support@usdtmarketplace.com</a></small>
  //         </div>
  //       </div>
  // `,
  forgetPasswordOtp:`<div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
            
            <h2 style="text-align: center; color: #007bff; border-bottom: 2px solid #007bff; padding-bottom: 10px;">USDT Marketplace</h2>
            
            <p style="font-size: 16px; line-height: 1.5;">Hello,</p>
            <p style="font-size: 16px; line-height: 1.5;">Your One-Time Password (OTP) for accessing USDT Marketplace is:</p>
    
            <div style="text-align: center; padding: 20px; margin: 20px 0; background-color: #f1f1f1; border-radius: 8px;">
              <p style="font-size: 36px; font-weight: bold; color: #007bff; margin: 0;">{{otp}}</p>
            </div>
    
            <p style="font-size: 16px; line-height: 1.5;">Please enter this OTP to complete your verification process. This OTP is valid for <strong>10 minutes</strong>.</p>
    
            <div style="background-color: #007bff; color: white; padding: 10px; border-radius: 8px; text-align: center; margin: 20px 0;">
              <p>If you did not request this OTP, please <a href="mailto:support@usdtmarketplace.com" style="color: white; text-decoration: underline;">contact our support team</a> immediately.</p>
            </div>
    
            <p style="font-size: 16px; line-height: 1.5;">Thank you,</p>
            <p style="font-size: 16px; line-height: 1.5;">The USDT Marketplace Team</p>
    
            <hr style="border: 0; height: 1px; background: #ddd; margin: 20px 0;">
            <small style="color: #666; font-size: 12px;">If you have any questions, feel free to reach out to us at <a href="mailto:support@usdtmarketplace.com" style="color: #007bff; text-decoration: none;">support@usdtmarketplace.com</a></small>
          </div>
        </div>`,

  emailUpdateVerification:`
  <p>Confirm your new email by clicking on this link: <a href="http://api.usdtmarketplace.com/confirm-email?token={{token}}>Update Email</a></p>
  `   
  ,  
  

  transactionSuccessfullTemplate: `<div style="font-family: Figtree, sans-serif; margin: 0; padding: 0;">
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
              <tr><td><b>Transaction ID:</b></td><td>1c9d0e5d-7bd7-40ea-b778-50a843b94a1d</td></tr>
              <tr><td><b>Amount Paid:</b></td><td>98.25 INR</td></tr>
              <tr><td><b>Crypto Received:</b></td><td>1.19 USDT</td></tr>
              <tr><td><b>Blockchain:</b></td><td>TRC20</td></tr>
              <tr><td><b>Transaction Hash:</b></td><td>5a8f3817af2446afd7a1abe25c457f93</td></tr>
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
    </style>`,

    helpAndSupport:` <div style="font-family: Figtree, sans-serif; margin: 0; padding: 0;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" align="center"
            style="max-width: 600px; background-color: #ffffff !important; border-radius: 12px; box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1); text-align: center; border: 1px solid #ddd;"
            bgcolor="#ffffff">

            <!-- Header with Logo -->
            <tr>
                <td
                    style="background-image: url('https://res.cloudinary.com/dbr9mrvja/image/upload/v1742885141/ocxzjfcdcecgxgmlvcvm.jpg'); background-size: cover; background-position: center;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                        <tr>
                            <td align="center"
                                style="background-color: rgba(0, 0, 0, 0.6) !important; padding: 15px; backdrop-filter: blur(10px) !important;">
                                <img src="https://res.cloudinary.com/dbr9mrvja/image/upload/v1742885169/eygnaio0rgsjsxkjxbcx.jpg"
                                    alt="USDT Logo" width="30" height="30"
                                    style="border-radius: 8px; vertical-align: middle;">
                                <h2 style="display: inline-block; margin: 0; font-size: 18px; color: white !important;">
                                    USDT Marketplace</h2>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>

            <!-- Title -->
            <tr>
                <td style="padding: 15px; text-align: center; background-color:#fafafa">
                    <h3 style="color: #6BA401 !important; font-size: 16px; font-weight: 700; margin: 2px 0;">Help &
                        Support</h3>
                </td>
            </tr>

            <!-- Body Content -->
            <tr>
                <td style="padding: 15px; text-align: left; font-size: 14px; color: #333;">
                    <p>Team,</p>
                    <p>A new user support concern has been submitted. Please review the details below:</p>
                    <p><b>User Email:</b> <a href="{{email}}"
                            style="color: #007bff;">{{email}}</a></p>
                    <p><b>Concern Title:</b> <strong>{{title}}</strong></p>
                    <p><b>Description:</b></p>
                    <p style="color: #000; font-weight: 500;">
                       {{description}}
                    </p>
                    <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;" />
                    <p>Please look into this at your earliest convenience and update the support status accordingly.</p>
                    <p>Thank you,<br />
                        The USDT Marketplace Team</p>
                </td>
            </tr>

            <!-- Footer -->
            <tr>
                <td style="padding: 15px; text-align: left; color: #00000099; font-size: 13px;">
                    Need help? Feel free to reach us at <a href="mailto:support@usdtmarketplace.com"
                        style="color: #007bff;">support@usdtmarketplace.com</a>.
                </td>
            </tr>
        </table>
    </div>

    <style>
        @media (prefers-color-scheme: dark) {

            body,
            table {
                background-color: #ffffff !important;
                color: #000000 !important;
            }

            a {
                color: #007bff !important;
            }
        }
    </style>
`,
loginOtp:`<div style="font-family: Figtree, sans-serif; margin: 0; padding: 0;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" align="center"
            style="max-width: 600px; background-color: #ffffff !important; border-radius: 12px; box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1); text-align: center; border: 1px solid #ddd;"
            bgcolor="#ffffff">

            <!-- Header with Logo -->
            <tr>
                <td
                    style="background-image: url('https://res.cloudinary.com/dbr9mrvja/image/upload/v1742885141/ocxzjfcdcecgxgmlvcvm.jpg'); background-size: cover; background-position: center;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                        <tr>
                            <td align="center"
                                style="background-color: rgba(0, 0, 0, 0.6) !important; padding: 15px; backdrop-filter: blur(10px) !important;">
                                <img src="https://res.cloudinary.com/dbr9mrvja/image/upload/v1742885169/eygnaio0rgsjsxkjxbcx.jpg"
                                    alt="USDT Logo" width="30" height="30"
                                    style="border-radius: 8px; vertical-align: middle;">
                                <h2 style="display: inline-block; margin: 0; font-size: 18px; color: white !important;">
                                    USDT Marketplace</h2>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>


            <!-- Body Content -->
            <tr>
                <td style="padding: 15px; text-align: left; font-size: 14px; color: #000000;">
                    <p>Dear User,</p>
                    <p>Please enter below OTP to login to your USDT Market place account.</p>
                    <p><b style='font-size:x-large;'>{{otp}}</b>
                    <p>Note : This OTP is valid for 10 minutes.</p>
                    <p>Best regards,</p>
                    <p>
                        The USDT Marketplace Team
                    </p>
                    </p>
                </td>
            </tr>

            <!-- Footer -->
            <tr>
                <td style="padding: 15px; text-align: left; color: #000000; font-size: 13px;">
                    Need help? Feel free to reach us at <a href="mailto:support@usdtmarketplace.com"
                        style="color: #007bff;">support@usdtmarketplace.com</a>.
                </td>
            </tr>
        </table>
    </div>

    <style>
        @media (prefers-color-scheme: dark) {

            body,
            table {
                background-color: #ffffff !important;
                color: #000000 !important;
            }

            a {
                color: #007bff !important;
            }
        }
    </style>`,


    signUpOtp:`<div style="font-family: Figtree, sans-serif; margin: 0; padding: 0;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" align="center"
            style="max-width: 600px; background-color: #ffffff !important; border-radius: 12px; box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1); text-align: center; border: 1px solid #ddd;"
            bgcolor="#ffffff">

            <!-- Header with Logo -->
            <tr>
                <td
                    style="background-image: url('https://res.cloudinary.com/dbr9mrvja/image/upload/v1742885141/ocxzjfcdcecgxgmlvcvm.jpg'); background-size: cover; background-position: center;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                        <tr>
                            <td align="center"
                                style="background-color: rgba(0, 0, 0, 0.6) !important; padding: 15px; backdrop-filter: blur(10px) !important;">
                                <img src="https://res.cloudinary.com/dbr9mrvja/image/upload/v1742885169/eygnaio0rgsjsxkjxbcx.jpg"
                                    alt="USDT Logo" width="30" height="30"
                                    style="border-radius: 8px; vertical-align: middle;">
                                <h2 style="display: inline-block; margin: 0; font-size: 18px; color: white !important;">
                                    USDT Marketplace</h2>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>


            <!-- Body Content -->
            <tr>
                <td style="padding: 15px; text-align: left; font-size: 14px; color: #000000;">
                    <p>Dear User,</p>
                    <p>Please enter below OTP to signup to your USDT Market place account.</p>
                    <p><b style='font-size:x-large;'>{{otp}}</b>
                    <p>Note : This OTP is valid for 10 minutes.</p>
                    <p>Best regards,</p>
                    <p>
                        The USDT Marketplace Team
                    </p>
                    </p>
                </td>
            </tr>

            <!-- Footer -->
            <tr>
                <td style="padding: 15px; text-align: left; color: #000000; font-size: 13px;">
                    Need help? Feel free to reach us at <a href="mailto:support@usdtmarketplace.com"
                        style="color: #007bff;">support@usdtmarketplace.com</a>.
                </td>
            </tr>
        </table>
    </div>

    <style>
        @media (prefers-color-scheme: dark) {

            body,
            table {
                background-color: #ffffff !important;
                color: #000000 !important;
            }

            a {
                color: #007bff !important;
            }
        }
    </style>`



  
};