import cryptoJs from "crypto-js";
import db from "../models/index.js";
import { compare, encrypt } from "../utils/password.util.js";

const { User } = db;
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
    if (user)
      return reply.status(200).send({ message: "Signup Successful" });
    else
      return reply.status(400).send({ message: "Signup failed" });
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
    console.log(user)
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

    user.token = token
    await user.save()
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
    const User1 = request.user
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

    if (!user)
      return reply.status(404).send({ error: "Invalid User details" }); // generic error to prevent bruteforce

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
    console.log('here', request.user)
    const { phone_number } = request.body;
    console.log(phone_number)
    // find user by username where role is not empty, and compare password
    const User1 = request.user
    let user = await User.scope("private").findOne({
      where: {
        email: User1.email,
      },
    });


    if (!user)
      return reply.status(400).send({ error: "Invalid User details" }); // generic error to prevent bruteforce'

    user.phone = phone_number
    const updated = await user.save()
    console.log("updates", updated)
    if (updated?.dataValues?.phone) {
      user.isPhoneAdded = true
      await user.save()
      return reply.status(200).send({ message: "Success" });
    }
    else
      reply.status(500).send({ error: "unable to update user phone number" });
  } catch (error) {
    reply.status(500).send({ error: error.message });
  }
}



/**
 * Authenticates an admin user and generates a login token.
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

    const user = request.user
    console.log('user', user.phone)
    const body = {
      email: user.email,
      phoneNumber: user.phone,
      clientCustomerId: user?.id ? user?.id : "1125268",
      type: "INDIVIDUAL",
    };
    console.log(body)
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
        console.log(data)
        return data
      })
      .catch((error) => console.error("Error:", error));
    if (user) { // Check if the user exists
      user.customerId = await response.customerId;
      user.kycUrl = await response.kycUrl 
      await user.save(); // Use await to ensure the save operation completes
    } else {
      console.error("User not found");
      reply.status(500).send({ error: 'User not found' });
    }

    console.log(response)
    return reply.status(200).send({ kyc_url: response.data.kycUrl })
  } catch (error) {
    reply.status(500).send({ error: error.message });
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