import cryptoJs from "crypto-js";
import db from "../models/index.js";
import { compare, encrypt } from "../utils/password.util.js";
import { Op } from "sequelize"
import logger from "../utils/logger.util.js";
import nodemailer from "nodemailer"
import { getAllCoinsData, getAllNetworkData, getWithdrawFee } from "../ApiCalls/usdtapicalls.js";
import {
  responseMapping,
  responseMappingError,
  responseMappingWithData,
} from "../utils/responseMapper.js";
import { Currencies } from "../utils/currencies.js";
import { networks } from "../utils/networks.js";
import { findRecord } from "../Dao/dao.js";
import { Sequelize } from "sequelize";

const { User, Coin, OnRampTransaction, Usdt,Otp } = db;
/**
 * Registers a new user.
 * @controller user
 * @route POST /api/v1/user/signup
 * @param {Object} request - The request object.
 * @param {Object} reply - The reply object.
 * @throws {Error} If an error occurs while signing up.
 */
export async function signup(request, reply) {
  try {
    const { emailId, otp,password } = request.body;
    // check if emailId exists. although we have checked above that no users exist, still this check is good for future additions to this route
    const userExists = await User.findOne({ where: { email: emailId } });
    if (userExists)
      return reply.status(409).send(responseMappingError(500, `User already exist`));

    const activeOtp = await Otp.findOne({
      where: {
        email:emailId,
        otp,
        sent_at: {
          [Op.gte]: new Date(new Date() - 5 * 60 * 1000), // 5 minutes
        },
      },
    });
    if (!activeOtp)  return reply.status(500).send(responseMappingError(500, `Incorrect otp or your otp is expired`))
    // encrypt password
    const encryptedPassword = await  encrypt(password);
    await Otp.destroy({
      where: { email:emailId },
    });
    // create user
    const user = await User.create({
      email: emailId,
      password: encryptedPassword,
    });
   
    if (user) return reply.status(200).send(responseMappingWithData(200, "success", "Signup success"));
    else return reply.status(500).send(responseMappingError(500, `Signup failed`));
  } catch (error) {
  return reply.status(500).send(responseMappingError(500, `Signup failed`));
  }
}


export async function sendSignUpOtp(request,reply){
  try{
    const email = request.query.email;
    const existingUser = await User.findOne({
      where: {
        email,
      }
    });

    if(existingUser){
      return reply.status(500).send(responseMappingError(500, `Account already exist`))
    }
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: "tshubhanshu007@gmail.com",
        pass: "zrni hfym gthq upiu"
      }
    })
    const otp = await generateOTP(email)
    // const mailOptions = {
    //   from: {
    //     name: "GSX solutions",
    //     address: "tshubhanshu007@gmail.com"
    //   },
    //   to: email,
    //   subject: "Forget password otp",
    //   text: `Hello, Here is your forget password ${otp}`,
    //   html: `
    //     <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    //       <h2 style="color: #0056b3;">USDT Marketplace</h2>
    //       <p>Hello,</p>
    //       <p>Your One-Time Password (OTP) for accessing USDT Marketplace is:</p>
    //       <p style="font-size: 24px; font-weight: bold; color: #0056b3;">${otp}</p>
    //       <p>Please enter this OTP to complete your verification process. This OTP is valid for 10 minutes.</p>
    //       <p>If you did not request this OTP, please contact our support team immediately.</p>
    //       <p>Thank you,</p>
    //       <p>The USDT Marketplace Team</p>
    //       <hr>
    //       <small>If you have any questions, feel free to reach out to us at <a href="mailto:support@usdtmarketplace.com">support@usdtmarketplace.com</a></small>
    //     </div>`
    // };
    const mailOptions = {
      from: {
        name: "GSX solutions",
        address: "tshubhanshu007@gmail.com"
      },
      to: email,
      subject: "Sign-up OTP",
      text: `Hello, your sign-up OTP is ${otp}`,
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
            
            <h2 style="text-align: center; color: #007bff; border-bottom: 2px solid #007bff; padding-bottom: 10px;">USDT Marketplace</h2>
            
            <p style="font-size: 16px; line-height: 1.5;">Hello,</p>
            <p style="font-size: 16px; line-height: 1.5;">Your One-Time Password (OTP) for Sign up in USDT Marketplace is:</p>
    
            <div style="text-align: center; padding: 20px; margin: 20px 0; background-color: #f1f1f1; border-radius: 8px;">
              <p style="font-size: 36px; font-weight: bold; color: #007bff; margin: 0;">${otp}</p>
            </div>
    
            <p style="font-size: 16px; line-height: 1.5;">Please enter this OTP to complete your sign up process. This OTP is valid for <strong>10 minutes</strong>.</p>
    
            <div style="background-color: #007bff; color: white; padding: 10px; border-radius: 8px; text-align: center; margin: 20px 0;">
              <p>If you did not request this OTP, please <a href="mailto:support@usdtmarketplace.com" style="color: white; text-decoration: underline;">contact our support team</a> immediately.</p>
            </div>
    
            <p style="font-size: 16px; line-height: 1.5;">Thank you,</p>
            <p style="font-size: 16px; line-height: 1.5;">The USDT Marketplace Team</p>
    
            <hr style="border: 0; height: 1px; background: #ddd; margin: 20px 0;">
            <small style="color: #666; font-size: 12px;">If you have any questions, feel free to reach out to us at <a href="mailto:support@usdtmarketplace.com" style="color: #007bff; text-decoration: none;">support@usdtmarketplace.com</a></small>
          </div>
        </div>
      `
    };
    await transporter.sendMail(mailOptions)
    return reply
    .status(200)
    .send(responseMappingWithData(200, "success", "please check otp on the given email"));
  }catch(error){
    console.log('user.controller.changePassword', error.message)
    return reply.status(500).send(responseMappingError(500, `Internal server error`))

  }
}


/**
 * Authenticates an  user and generates a login token.
 * @controller admin
 * @route POST /api/v1/user/login
 * @param {Object} request - The request object.
 * @param {Object} reply - The reply object.
 * @throws {Error} If an error occurs while logging in.
 */
export async function login(request, reply) {
  // login for admin team members
  try {
    const { emailId, password } = request.body;
    // find user by username where role is not empty, and compare password
    const user = await User.scope("private").findOne({
      where: {
        email: emailId,
      },
    });
    console.log(user);
    if (!user)
      return reply.status(404).send(responseMappingError(404, "User doesnt exist")); // generic error to prevent bruteforce
    // compare password
    const match = await compare(password, user.password);
    if (!match)
      return reply.status(401).send(responseMappingError(401, "Invalid username or password")); // generic error to prevent bruteforce
    // generate token
    const token = await reply.jwtSign({
      id: user.id,
      role: user.role,
      emailId: user.email,
    });

    user.token = token;
    await user.save();
    // set token in cookie
    reply.setCookie("token", token, {
      httpOnly: true,
      // secure: is_prod,
      sameSite: "strict",
      // signed: true, // dont use signed cookies with JWT
      expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 days
      path: "/",
    });
    return reply.status(200).send(responseMappingWithData(200, "Logged in", token ));
  } catch (error) {
    reply.status(500).send(responseMappingError(500, error.message));
  }
}

/**
 * gets user profile data.
 * @controller admin
 * @route POST /api/v1/user/profile
 * @param {Object} request - The request object.
 * @param {Object} reply - The reply object.
 * @throws {Error} If an error occurs while logging in.
 */
export async function getProfile(request, reply) {
  // login for admin team members
  try {
    // find user by username where role is not empty, and compare password
    const User1 = request.user;
    let user = await User.scope("private").findOne({
      where: {
        email: User1.email,
      },
    });
    if (user) {
      user = user.toJSON(); // Convert the Sequelize instance to a plain object
      delete user.password;
      delete user.token;
    }

    if (!user) return reply.status(404).send(responseMappingError(404, "Invalid User details")); // generic error to prevent bruteforce

    return reply.status(200).send(responseMappingWithData(200, "Success", user ));
  } catch (error) {
    reply.status(500).send(responseMappingError(500, error.message));
  }
}

/**
 * updates user phone number.
 * @controller user
 * @route POST /api/v1/user/add/phone
 * @param {Object} request - The request object.
 * @param {Object} reply - The reply object.
 * @throws {Error} If an error occurs while logging in.
 */
export async function updatePhone(request, reply) {
  // login for admin team members
  try {
    const { phone_number } = request.body;
    console.log(phone_number);
    // find user by username where role is not empty, and compare password
    const User1 = request.user;
    let user = await User.scope("private").findOne({
      where: {
        email: User1.email,
      },
    });
    let phoneExists = await User.findOne({
      where: {
        phone: phone_number
      }
    })
    if (phoneExists)
      return reply.status(400).send({ error: "Phone number already exists" });

    if (!user) return reply.status(400).send(responseMappingError(400, "Invalid User details")); // generic error to prevent bruteforce'
    user.phone = phone_number;
    const updated = await user.save();
    console.log("updates", updated);
    if (updated?.dataValues?.phone) {
      user.isPhoneAdded = true;
      await user.save();
      return reply.status(200).send(responseMapping(200, "Success"));
    } else
      reply.status(500).send(responseMappingError(500, "unable to update user phone number"));
  } catch (error) {
    reply.status(500).send(responseMappingError(500, error.message));
  }
}

/**
 * gets all crypto coins for user.
 * @controller user
 * @route GET /api/v1/user/getAllCoins
 * @param {Object} request - The request object.
 * @param {Object} reply - The reply object.
 * @throws {Error} If an error occurs while logging in.
 */
export async function getAllCoins(request, reply) {
  try {
    let coins = await Coin.findAll();
  
    console.log("got coins", coins[0])
    let coinsArray = [];
    if (coins.length <= 0) {
      let coinsData = await getAllCoinsData();
      coins = coinsData?.data;
      if (coins) {
        coinsArray = Object.entries(coins).map(([coin, coinDetails]) => ({
          coin,
          coinid: coinDetails.coinId,
          ...coinDetails,
        }));
        console.log('here', coinsArray[0])
        try {
          await Coin.bulkCreate(coinsArray, {
            updateOnDuplicate: [
              "coin",
              "coinid",
              "coinIcon",
              "coinName",
              "balanceFloatPlaces",
            ],
          });
          console.log("Coins saved successfully!");
        } catch (error) {
          console.error("Error saving coins: ", error);
        }
      }
    }
    //console.log('data',coins)
    //console.log("data array", coinsArray);

    if (coins?.length > 0 || coinsArray?.length > 0) {
      const filteredCoins = coinsArray?.length > 0
      ? coinsArray.filter((coin) => coin.coinid === 54).map(coin => ({
          ...coin.dataValues,
          minSellValue: 10 // Replace with actual logic
        }))
      : coins.filter((coin) => coin.coinid === 54).map(coin => ({
          ...coin.dataValues,
          minSellValue: 10 // Replace with actual logic
        }));



      return reply
        .status(200)
        .send(responseMappingWithData(200, "success", filteredCoins));
    } else reply.status(500).send(responseMappingError(500, "unable to get coins"));
  } catch (error) {
    reply.status(500).send(responseMappingError(500, error.message));
  }
}

/**
 * gets all currencies.
 * @controller user
 * @route GET /api/v1/user/getAllCurrencies
 * @param {Object} request - The request object.
 * @param {Object} reply - The reply object.
 * @throws {Error} If an error occurs while logging in.
 */
export async function getAllCurrencies(request, reply) {
  try {
    const data = Currencies;
    let query ={
      id:1
    }
    const usdt = await findRecord(Usdt,query)
    const updatedData = data.map(currency => ({
      ...currency,
      minSellValue: (Number(10)*Number(usdt.inrRateOfframp)).toFixed(2) - 50
    }));
    if (data) {
      return reply
        .status(200)
        .send(responseMappingWithData(200, "success", updatedData));
    } else reply.status(500).send(responseMappingError(500, "unable to get currencies"));
  } catch (error) {
    reply.status(500).send(responseMappingError(500, error.message));
  }
}

/**
 * gets all networks
 * @controller user
 * @route GET /api/v1/user/getAllNetworks
 * @param {Object} request - The request object.
 * @param {Object} reply - The reply object.
 * @throws {Error} If an error occurs while logging in.
 */
export async function getAllNetworks(request, reply) {
  try {
    console.log(request.query.id)
    if (!request.query.id) {
      reply.status(500).send(responseMappingError(500, "please send coin id"));
    }
    if (request.query.id !== '54') {
      reply.status(500).send(responseMappingError(500, "invalid coin id"));
    }
    const data = networks
    let updatedData = []
    const coinData = await Coin.findOne({
      where: {
        coinid: request.query.id
      }
    })
    const networkData = await getAllNetworkData()
    const filteredNetworks = networkData.filter(item => item.coinid == 54)
    //console.log("network data",filteredNetworks)
    //console.log(coinData)
    let query ={
      id:1
    }
    const usdt = await findRecord(Usdt,query)
      if (coinData) {
      data.map((item) => {
        const networkData = filteredNetworks.filter(Item => Item.networkId == item.chainId)
        //console.log("here", networkData)
        if (networkData[0]?.withdrawalFee) {

          updatedData.push({
            ...item,
            icon: coinData.coinIcon,
            fee: networkData[0]?.withdrawalFee,
            minBuy: networkData[0]?.minimumWithdrawal,
            minBuyInRupee: usdt?.inrRate ? Math.ceil(Number(networkData[0]?.minimumWithdrawal) * usdt?.inrRate) : Math.ceil(networkData[0]?.minimumWithdrawal),
            inSync:true
          })
        }
      })
    }
    if (updatedData) {
      return reply
        .status(200)
        .send(responseMappingWithData(200, "success", updatedData));
    } else reply.status(500).send(responseMappingError(500, "unable to get networks"));
  } catch (error) {
    reply.status(500).send(responseMappingError(500, error.message));
  }
}

/**
 * Gets kyc url for user.
 * @controller user
 * @route POST /api/v1/user/kyc/url
 * @param {Object} request - The request object.
 * @param {Object} reply - The reply object.
 * @throws {Error} If an error occurs while logging in.
 */
export async function getKycUrl(request, reply) {
  try {
    // const {  phone_number  } = request.body;
    const apiKey = process.env.apiKey;
    const secret = process.env.secret;

    const userData = request.user;
    const user = await User.scope("private").findOne({
      where: {
        email: userData.email,
      },
    });
    console.log("user", user.phone);
    if (!user) {
      return reply.status(400).send(responseMappingError(200, "User not found"));
    }
    if(!user.phone)
    {
      return reply.status(400).send(responseMappingError(200, "please add phone number"));
    }
    if (user.kycUrl) {
      return reply.status(200).send(responseMappingWithData(200,"success",{kyc_url: user.kycUrl }));
    }
    const body = {
      email: user.email,
      phoneNumber: user.phone,
      clientCustomerId: user?.id ? user?.id : "1125268",
      type: "INDIVIDUAL",
      kycRedirectUrl: "https://widget.usdtmarketplace.com/?type=onramp",
    };
    console.log(body);
    const timestamp = Date.now().toString();
    const obj = {
      body,
      timestamp,
    };

    // Create the payload and signature
    const payload = cryptoJs.enc.Base64.stringify(
      cryptoJs.enc.Utf8.parse(JSON.stringify(obj))
    );
    const signature = cryptoJs.enc.Hex.stringify(
      cryptoJs.HmacSHA512(payload, secret)
    );

    // Create the headers
    const headers = {
      "Content-Type": "application/json",
      apiKey: apiKey,
      payload: payload,
      signature: signature,
    };

    // Make the fetch request
    const url =
      "https://api.onramp.money/onramp/api/v2/whiteLabel/kyc/url";

    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        return data;
      })
      .catch((error) => console.error("Error:", error));
    console.log("resp", response);
    if (user && response?.data?.customerId) {
      // Check if the user exists
      user.customerId = await response.data.customerId;
      user.kycUrl = await response.data.kycUrl;
      await user.save(); // Use await to ensure the save operation completes
    } else {
      reply.status(500).send(responseMappingError(500, "internal sever error"));
    }

    console.log(response);
    return reply
      .status(200)
      .send(responseMappingWithData(200,"success",{kyc_url: response.data.kycUrl }));
  } catch (error) {
    reply.status(500).send({ status: 500, error: error.message });
  }
}


export async function onRampRequest(request, reply) {
  try {
    const apiKey = process.env.apiKey;
    const secret = process.env.secret;

    const { fromCurrency, toCurrency, chain, paymentMethodType, depositAddress, fromAmount, toAmount, rate } = request.body

    if (!request.user.isKycCompleted) {
      return reply.status(500).send(responseMappingError(500, "Please complete your kyc"))
    }
    const dataNet = networks
    let updatedData = []
    const coinData = await Coin.findOne({
      where: {
        coinid: 54
      }
    })
    const networkData = await getAllNetworkData()
    const filteredNetworks = networkData.filter(item => item.coinid == 54)
    //console.log("network data",filteredNetworks)
    //console.log(coinData)
    let query ={
      id:1
    }
    const usdt = await findRecord(Usdt,query)
      if (coinData) {
        dataNet.map((item) => {
        const networkData = filteredNetworks.filter(Item => Item.networkId == item.chainId)
        //console.log("here", networkData)
        if (networkData[0]?.withdrawalFee) {

          updatedData.push({
            ...item,
            icon: coinData.coinIcon,
            fee: networkData[0]?.withdrawalFee,
            minBuy: networkData[0]?.minimumWithdrawal,
            minBuyInRupee: usdt?.inrRate ? Math.ceil(Number(networkData[0]?.minimumWithdrawal) * usdt?.inrRate) : Math.ceil(networkData[0]?.minimumWithdrawal)
          })
        }
      })
    }
    const minWithdrawl = updatedData.find((item)=> item.chainSymbol == chain)
    console.log(minWithdrawl)
    if(minWithdrawl.minBuyInRupee>fromAmount)
    return reply.status(500).send(responseMappingError(400, `Amount should be greater than ${minWithdrawl.minBuyInRupee}`))

    let body = {
      fromCurrency: fromCurrency,
      toCurrency: toCurrency,
      chain: chain,
      paymentMethodType: paymentMethodType,
      depositAddress: depositAddress,
      customerId: request.user.customerId,
      fromAmount: fromAmount,
      toAmount: toAmount,
      rate: rate
    }


    const timestamp = Date.now().toString();
    const obj = {
      body,
      timestamp,
    };

    // Create the payload and signature
    const payload = cryptoJs.enc.Base64.stringify(
      cryptoJs.enc.Utf8.parse(JSON.stringify(obj))
    );
    const signature = cryptoJs.enc.Hex.stringify(
      cryptoJs.HmacSHA512(payload, secret)
    );

    // Create the headers
    const headers = {
      "Content-Type": "application/json",
      apiKey: apiKey,
      payload: payload,
      signature: signature,
    };


    const url =
      "https://api.onramp.money/onramp/api/v2/whiteLabel/onramp/createTransaction"

    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      // Handle HTTP errors, e.g., 404, 500, etc.
       const errResponse = await response.json()
            console.log(errResponse)
            throw new Error(`${errResponse.error}`);
    }

    const data = await response.json();
    console.log(data);
    if(data.data.transactionId)
    {

      body.user_id = request.user.id,
      body.reference_id = data.data.transactionId
      
      const transaction = await OnRampTransaction.create(body)
      
      return reply
      .status(200)
      .send(responseMappingWithData(200, "success", data.data.fiatPaymentInstructions));
    }else{
      return reply.status(500).send(responseMappingError(500, "Unable to process your request at the moment"))

    }
  } catch (error) {
    console.log("this is error", error.message)
    return reply.status(500).send(responseMappingError(500, `internal server error`))
  }
}


// {
//   "status": 1,
//   "code": 200,
//   "data": {
//       "kycUrl": "https://test.onramp.money/onramp/main/profile/?appId=1255377&kybData=d1450c0434fb0ea554b0470edbb011d05e1f16be0f8ba17466fed0e958e2aa51",
//       "clientCustomerId": 1,
//       "customerId": "1T7cEoPvMD_2144",
//       "signature": "d1450c0434fb0ea554b0470edbb011d05e1f16be0f8ba17466fed0e958e2aa51"
//   }
// }

export async function getQuotes(request, reply) {
  try {
    const { fromCurrency, toCurrency, fromAmount, chain, paymentMethodType } = request.body
    const apiKey = process.env.apiKey;
    const secret = process.env.secret;
    let body ={
      fromCurrency: fromCurrency,
      toCurrency: toCurrency,
      fromAmount: fromAmount,
      chain: chain,
      paymentMethodType: paymentMethodType
    }
    // if(fromCurrency=="INR")
    // {

    //   body = {
    //     fromCurrency: fromCurrency,
    //     toCurrency: toCurrency,
    //     fromAmount: fromAmount,
    //     chain: chain,
    //     paymentMethodType: paymentMethodType
    //   }
    // }else if(fromCurrency=="USDT")
    // {
    //   let query ={
    //     id:1
    //   }
    //   const usdt = await findRecord(Usdt,query)
    //   body = {
    //     fromCurrency: "INR",
    //     toCurrency: "USDT",
    //     fromAmount: fromAmount*usdt.inrRate,
    //     chain: chain,
    //     paymentMethodType: paymentMethodType
    //   }
    // }
    const dataNet = networks
    let updatedData = []
    const coinData = await Coin.findOne({
      where: {
        coinid: 54
      }
    })
    const networkData = await getAllNetworkData()
    const filteredNetworks = networkData.filter(item => item.coinid == 54)
    //console.log("network data",filteredNetworks)
    //console.log(coinData)
    let query ={
      id:1
    }
    const usdt = await findRecord(Usdt,query)
      if (coinData) {
        dataNet.map((item) => {
        const networkData = filteredNetworks.filter(Item => Item.networkId == item.chainId)
        //console.log("here", networkData)
        if (networkData[0]?.withdrawalFee) {

          updatedData.push({
            ...item,
            icon: coinData.coinIcon,
            fee: networkData[0]?.withdrawalFee,
            minBuy: networkData[0]?.minimumWithdrawal,
            minBuyInRupee: usdt?.inrRate ? Math.ceil(Number(networkData[0]?.minimumWithdrawal) * usdt?.inrRate) : Math.ceil(networkData[0]?.minimumWithdrawal)          })
        }
      })
    }
    const minWithdrawl = updatedData.find((item)=> item.chainSymbol == chain)
    console.log(minWithdrawl)
    if(minWithdrawl.minBuyInRupee>fromAmount)
    return reply.status(500).send(responseMappingError(400, `Amount should be greater than ${minWithdrawl.minBuyInRupee}`))
    const timestamp = Date.now().toString();
    const obj = {
      body,
      timestamp,
    };

    // Create the payload and signature
    const payload = cryptoJs.enc.Base64.stringify(
      cryptoJs.enc.Utf8.parse(JSON.stringify(obj))
    );
    const signature = cryptoJs.enc.Hex.stringify(
      cryptoJs.HmacSHA512(payload, secret)
    );

    // Create the headers
    const headers = {
      "Content-Type": "application/json",
      apiKey: apiKey,
      payload: payload,
      signature: signature,
    };
    const cachedData = request.server.redis.get(`${apiKey}-${payload}-${signature}`)

    if(cachedData){
      let data_cache = await JSON.parse(cachedData);
      console.log(data_cache);
      if(data_cache.data)
      {
        let updatedData = data_cache.data
        updatedData.feeInUsdt = Number(data_cache?.data?.fees[0]?.gasFee)/Number(data_cache?.data?.rate)
        return reply
        .status(200)
        .send(responseMappingWithData(200, "success", updatedData));
    }
    }


    const url =
      "https://api.onramp.money/onramp/api/v2/whiteLabel/onramp/quote"

    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      // Handle HTTP errors, e.g., 404, 500, etc.
      const errResponse = await response.json()
      console.log(errResponse)
      throw new Error(`${errResponse.error}`);
      
    }

   await request.server.redis.set(`${apiKey}-${payload}-${signature}`,JSON.stringify(response.json()),'EX',7200)
    let data = await response.json();
    console.log(data);
    if(data.data)
    {
      let updatedData = data.data
      updatedData.feeInUsdt = Number(data?.data?.fees[0]?.gasFee)/Number(data?.data?.rate)
      return reply
      .status(200)
      .send(responseMappingWithData(200, "success", updatedData));
    }else{
      return reply
      .status(200)
      .send(responseMappingWithData(200, "success", 0));
    }

  } catch (error) {
    logger.error("user.controller.getQuotes", error.message)
    console.log('user.controller.getQUotes', error.message)
    return reply.status(500).send(responseMappingError(500, `${error.message}`))

  }
}


export async function getAllOnRampTransaction(request, reply) {
  try {
    const all_on_ramp = await OnRampTransaction.findAll({
      where: {
        uuid: request.user.id
      }
    })

  } catch (error) {
    logger.error("user.controller.getQuotes", error.message)
    console.log('user.controller.getQUotes', error.message)
    return reply.status(500).send(responseMapping(500, `Internal server error`))

  }
}

export async function getUsdtRate(request, reply) {
  try {
    let query ={
      id:1
    }
    const usdt = await findRecord(Usdt,query)
    if(usdt)
    {
      return reply
      .status(200)
      .send(responseMappingWithData(200, "success", usdt.inrRate));
    }else{
      return reply.status(500).send(responseMappingError(500, 0))

    }
  } catch (error) {
    logger.error("user.controller.getQuotes", error.message)
    console.log('user.controller.getQUotes', error.message)
    return reply.status(500).send(responseMappingError(500, `Internal server error`))

  }
}


export async function changePassword(request,reply){
  try{
    const {newPassword,oldPassword} = request.body
    const user = await  User.scope("private").findOne({where:{id:request.user.id}})
    const match =await compare(oldPassword, user.password);
    if (!match) return reply.status(401).send(responseMappingError(500, `Wrong password`)); // generic error to prevent bruteforce
    const encryptedPassword =await encrypt(newPassword);
    user.password = encryptedPassword
    await user.save()
    return reply
    .status(200)
    .send(responseMappingWithData(200, "success", "success"));
  }catch(error){
    console.log('user.controller.changePassword', error.message)
    return reply.status(500).send(responseMappingError(500, `${error.message}`))
  }
}


export async function sendForgetPasswordOtp(request,reply){
  try{
    const email = request.query.email;
    const existingUser = await User.findOne({
      where: {
        email,
      }
    });

    if(!existingUser){
      return reply.status(500).send(responseMappingError(500, `Email doesn't exist`))

    }
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: "tshubhanshu007@gmail.com",
        pass: "zrni hfym gthq upiu"
      }
    })
    const otp = await generateOTP(email)
    // const mailOptions = {
    //   from: {
    //     name: "GSX solutions",
    //     address: "tshubhanshu007@gmail.com"
    //   },
    //   to: email,
    //   subject: "Forget password otp",
    //   text: `Hello, Here is your forget password ${otp}`,
    //   html: `
    //     <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    //       <h2 style="color: #0056b3;">USDT Marketplace</h2>
    //       <p>Hello,</p>
    //       <p>Your One-Time Password (OTP) for accessing USDT Marketplace is:</p>
    //       <p style="font-size: 24px; font-weight: bold; color: #0056b3;">${otp}</p>
    //       <p>Please enter this OTP to complete your verification process. This OTP is valid for 10 minutes.</p>
    //       <p>If you did not request this OTP, please contact our support team immediately.</p>
    //       <p>Thank you,</p>
    //       <p>The USDT Marketplace Team</p>
    //       <hr>
    //       <small>If you have any questions, feel free to reach out to us at <a href="mailto:support@usdtmarketplace.com">support@usdtmarketplace.com</a></small>
    //     </div>`
    // };
    const mailOptions = {
      from: {
        name: "GSX solutions",
        address: "tshubhanshu007@gmail.com"
      },
      to: email,
      subject: "Forget Password OTP",
      text: `Hello, your forget password OTP is ${otp}`,
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
            
            <h2 style="text-align: center; color: #007bff; border-bottom: 2px solid #007bff; padding-bottom: 10px;">USDT Marketplace</h2>
            
            <p style="font-size: 16px; line-height: 1.5;">Hello,</p>
            <p style="font-size: 16px; line-height: 1.5;">Your One-Time Password (OTP) for accessing USDT Marketplace is:</p>
    
            <div style="text-align: center; padding: 20px; margin: 20px 0; background-color: #f1f1f1; border-radius: 8px;">
              <p style="font-size: 36px; font-weight: bold; color: #007bff; margin: 0;">${otp}</p>
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
        </div>
      `
    };
    await transporter.sendMail(mailOptions)
    return reply
    .status(200)
    .send(responseMappingWithData(200, "success", "please check otp on the given email"));
  }catch(error){
    console.log('user.controller.changePassword', error.message)
    return reply.status(500).send(responseMappingError(500, `Internal server error`))

  }
}


export async function changeForgetPassword (request,reply){
  try{

    const { email,otp,newPassword} = request.body
    const activeOtp = await Otp.findOne({
      where: {
        email,
        otp,
        sent_at: {
          [Op.gte]: new Date(new Date() - 5 * 60 * 1000), // 5 minutes
        },
      },
    });

    if (!activeOtp)  return reply.status(500).send(responseMappingError(500, `Incorrect otp or your otp is expired`))

    let user = await User.findOne({where:{email:email}})
    if (!user){
      return reply.status(500).send(responseMappingError(500, `Email doesn't exist`))
    }
    const encryptedPassword =await encrypt(newPassword);
    user.password = encryptedPassword
    await user.save()

    await Otp.destroy({
      where: { email },
    });
    return reply
    .status(200)
    .send(responseMappingWithData(200, "success", "success"));


  }catch(error){
    console.log('user.controller.changePassword', error.message)
    return reply.status(500).send(responseMappingError(500, `Internal server error`))
  }
}



/**
 * Generates a one-time password (OTP) for the given phone number.
 * @param {string} phone - The phone number for which to generate the OTP.
 * @returns {Promise<string>} - A promise that resolves to the generated OTP.
 * @throws {Error} - If there is an error while generating the OTP.
*/
export async function generateOTP(email) {
  try {
    let otp;

    const last_otp = await Otp.findOne({
      where: {
        email,
        createdAt: {
          [Op.gte]: new Date(new Date() - 5 * 60 * 1000), // created within 5 mins
        },
      },
    });
    // if otp is already generated (within 5 mins) then return that otp, else generate new otp
    if (last_otp) {
      otp = last_otp.otp;
    } else {
      otp = Math.floor(1000 + Math.random() * 9000).toString(); // 4 digit otp (string)
      await Otp.create({ email, otp });
    }
    return otp;
  } catch (err) {
    logger.error(`generateOTP: ${err}`);
    throw err;
  }
}
