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
    const userExists = await User.findOne({ where: { email:emailId } });
    if (userExists)
      return reply.status(409).send({ error: "Username already taken" });
    // encrypt password
    const encryptedPassword = await encrypt(password);
    // create user
    const user = await User.create({
      email:emailId,
      password: encryptedPassword,
    });
    if(user)
    return reply.status(200).send({ message: "Signup Successful" });
    else
    return reply.status(400).send({ message: "Signup failed" });
  } catch (error) {
    reply.status(500).send({ error: error.message });
  }
}

/**
 * Authenticates an admin user and generates a login token.
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
        email:emailId,
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
 * Authenticates an admin user and generates a login token.
 * @controller user
 * @route POST /api/v1/user/kyc/url
 * @param {Object} request - The request object.
 * @param {Object} reply - The reply object.
 * @throws {Error} If an error occurs while logging in.
 */
export async function getKycUrl(request, reply) {
  try {
    const { email_id, phone_number  } = request.body;
    const apiKey = process.env.apiKey;
    const secret = process.env.secret;

    const user = request.user

    const body = {
      email: email_id,
      phoneNumber: phone_number,
      clientCustomerId: user?.id?user?.id:"1125268",
      type: "INDIVIDUAL",
    };

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

   const response = fetch(url, {
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
        user.customerId = response.customerId;
        await user.save(); // Use await to ensure the save operation completes
      } else {
        console.error("User not found");
        reply.status(500).send({ error: 'User not found'});
      }
      return response
  } catch (error) {
    reply.status(500).send({ error: error.message });
  }
}
