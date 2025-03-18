import twilio from 'twilio'
export async function createMessage(otp,phone) {
  try{
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = twilio(accountSid, authToken);
  const message = await client.messages.create({
    body: `Your one time password (OTP) for Log-in USDT Marketplace is: @usdt-marketplace.com #${otp}`,
    to: `${phone}`,
    from: process.env.TWILIIO_PHONE_NUMBER,
  });
  // console.log("message response ",message)
  return message
  }catch(error){
    console.log(`user.controller.createMessage`,error.message)
    return false

  }
}
