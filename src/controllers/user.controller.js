import cryptoJs from "crypto-js";
import db from "../models/index.js";
import { compare, encrypt } from "../utils/password.util.js";
import logger from "../utils/logger.util.js";
import { getAllCoinsData } from "../ApiCalls/usdtapicalls.js";
import {
  responseMapping,
  responseMappingWithData,
} from "../utils/responseMapper.js";
import { Currencies } from "../utils/currencies.js";
import { networks } from "../utils/networks.js";

const { User, Coin, OnRampTransaction } = db;
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
    const { emailId, password } = request.body;
    // check if emailId exists. although we have checked above that no users exist, still this check is good for future additions to this route
    const userExists = await User.findOne({ where: { email: emailId } });
    if (userExists)
      return reply.status(409).send({ error: "Username already taken" });
    // encrypt password
    const encryptedPassword = await encrypt(password);
    // create user
    const user = await User.create({
      email: emailId,
      password: encryptedPassword,
    });
    if (user) return reply.status(200).send({ message: "Signup Successful" });
    else return reply.status(400).send({ message: "Signup failed" });
  } catch (error) {
    reply.status(500).send({ error: error.message });
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
      return reply.status(404).send({ error: "Invalid email or password" }); // generic error to prevent bruteforce
    // compare password
    const match = await compare(password, user.password);
    if (!match)
      return reply.status(401).send({ error: "Invalid username or password" }); // generic error to prevent bruteforce
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
    return reply.status(200).send({ message: "Logged in", token });
  } catch (error) {
    reply.status(500).send({ error: error.message });
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

    if (!user) return reply.status(404).send({ error: "Invalid User details" }); // generic error to prevent bruteforce

    return reply.status(200).send({ message: "Success", user });
  } catch (error) {
    reply.status(500).send({ error: error.message });
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

    if (!user) return reply.status(400).send({ error: "Invalid User details" }); // generic error to prevent bruteforce'
    user.phone = phone_number;
    const updated = await user.save();
    console.log("updates", updated);
    if (updated?.dataValues?.phone) {
      user.isPhoneAdded = true;
      await user.save();
      return reply.status(200).send({ message: "Success" });
    } else
      reply.status(500).send({ error: "unable to update user phone number" });
  } catch (error) {
    reply.status(500).send({ error: error.message });
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
    let coinsArray = [];
    if (coins.length <= 0) {
      let coinsData = await getAllCoinsData();
      coins = coinsData?.data;
      if (coins) {
        coinsArray = Object.entries(coins).map(([coin, coinDetails]) => ({
          coin,
          ...coinDetails,
        }));
        try {
          await Coin.bulkCreate(coinsArray, {
            updateOnDuplicate: [
              "coin",
              "coinId",
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
      const filteredCoins =
        coinsArray?.length > 0
          ? coinsArray.filter((coin) => coin.coinId === 54)
          : coins.filter((coin) => coin.coinId === 54);

      return reply
        .status(200)
        .send(responseMappingWithData(200, "success", filteredCoins));
    } else reply.status(500).send(responseMapping(500, "unable to get coins"));
  } catch (error) {
    reply.status(500).send(responseMapping(500, error.message));
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
    if (data) {
      return reply
        .status(200)
        .send(responseMappingWithData(200, "success", data));
    } else reply.status(500).send(responseMapping(500, "unable to get currencies"));
  } catch (error) {
    reply.status(500).send(responseMapping(500, error.message));
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
      reply.status(500).send(responseMapping(500, "please send coin id"));
    }
    if (request.query.id !== '54') {
      reply.status(500).send(responseMapping(500, "invalid coin id"));
    }
    const data = networks
    let updatedData = []
    const coinData = await Coin.findOne({
      where: {
        coinId: request.query.id
      }
    })
    //console.log(coinData)
    if (coinData) {
      data.map((item) => {
        updatedData.push({
          ...item,
          icon: coinData.coinIcon
        })
      })
    }
    if (updatedData) {
      return reply
        .status(200)
        .send(responseMappingWithData(200, "success", updatedData));
    } else reply.status(500).send(responseMapping(500, "unable to get networks"));
  } catch (error) {
    reply.status(500).send(responseMapping(500, error.message));
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
      return reply.status(400).send({ status: 200, error: "User not found" });
    }
    if (user.kycUrl) {
      return reply.status(200).send({ status: 200, kyc_url: user.kycUrl });
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
      "https://api-test.onramp.money/onramp/api/v2/whiteLabel/kyc/url";

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
      reply.status(500).send({ error: "internal sever error" });
    }

    console.log(response);
    return reply
      .status(200)
      .send({ status: 200, kyc_url: response.data.kycUrl });
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
      return reply.status(500).send(responseMapping(500, "Please complete your kyc"))
    }

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
      "https://api-test.onramp.money/onramp/api/v2/whiteLabel/onramp/createTransaction"

    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      // Handle HTTP errors, e.g., 404, 500, etc.
      console.log(await response.json())
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);

    body.user_id = request.user.id,
      body.reference_id = data.data.transactionId

    const transaction = await OnRampTransaction.create(body)

    return reply
      .status(200)
      .send(responseMappingWithData(200, "success", data.data.fiatPaymentInstructions));
  } catch (error) {
    console.log("this is error", error.message)
    return reply.status(500).send(responseMapping(500, `${error.message}`))
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

    const body = {
      fromCurrency: fromCurrency,
      toCurrency: toCurrency,
      fromAmount: fromAmount,
      chain: chain,
      paymentMethodType: paymentMethodType
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
      "https://api-test.onramp.money/onramp/api/v2/whiteLabel/onramp/quote"

    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      // Handle HTTP errors, e.g., 404, 500, etc.
      console.log(await response.json())
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);

    return reply
      .status(200)
      .send(responseMappingWithData(200, "success", data.data));

  } catch (error) {
    logger.error("user.controller.getQuotes", error.message)
    console.log('user.controller.getQUotes', error.message)
    return reply.status(500).send(responseMapping(500, `${error.message}`))

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