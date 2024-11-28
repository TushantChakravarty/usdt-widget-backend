import { compare } from "bcryptjs";
import { findAllRecord, findCombinedRecords, findOneAndUpdate, getFee } from "../Dao/dao.js";
import db from "../models/index.js";
import { encrypt } from "../utils/password.util.js";
import { responseMappingError, responseMapping, responseMappingWithData } from "../utils/responseMapper.js";
const { User, OnRampTransaction, OffRampTransaction, Payout, Admin, Fees, Usdt } = db;

/**
 * Registers a new admin.
 * @controller admin
 * @route POST /api/v1/admin/signup
 * @param {Object} request - The request object.
 * @param {Object} reply - The reply object.
 * @throws {Error} If an error occurs while signing up.
 */
export async function signup(request, reply) {
    try {
      const { emailId,password } = request.body;
      // check if emailId exists. although we have checked above that no users exist, still this check is good for future additions to this route
      const userExists = await Admin.findOne({ where: { email: emailId } });
      console.log(userExists)
      if (userExists)
        return reply.status(409).send(responseMappingError(500, `User already exist`));
  
      // encrypt password
      
      const encryptedPassword = await encrypt(password);
      console.log('enc password', encryptedPassword)
      // create user
      const admin = await Admin.create({
        email: emailId,
        password: encryptedPassword,
        role:'master_admin'
      });
     console.log('admin check', admin)
      if (admin) return reply.status(200).send(responseMappingWithData(200, "success", "Signup success"));
      else return reply.status(500).send(responseMappingError(500, `Signup failed`));
    } catch (error) {
    return reply.status(500).send(responseMappingError(500, `Signup failed`));
    }
  }

/**
 * Authenticates an  admin and generates a login token.
 * @controller admin
 * @route POST /api/v1/admin/login
 * @param {Object} request - The request object.
 * @param {Object} reply - The reply object.
 * @throws {Error} If an error occurs while logging in.
 */
export async function login(request, reply) {
    // login for admin team members
    try {
      const { emailId, password } = request.body;
      // find user by username where role is not empty, and compare password
      const user = await Admin.scope("private").findOne({
        where: {
          email: emailId,
        },
      });
      //console.log(user);
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
     // console.log('user', user)
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
 * get all users
 * @controller admin
 * @route POST /api/v1/admin/getUsers
 * @param {Object} request - The request object.
 * @param {Object} reply - The reply object.
 * @throws {Error} If an error occurs while logging in.
 */
export async function getUsers(request, reply) {
    try {
      const users = await findAllRecord(User)
      console.log(users);
      if (!users)
        return reply.status(404).send(responseMappingError(404, "User doesnt exist")); // generic error to prevent bruteforce
    
      return reply.status(200).send(responseMappingWithData(200, "Success", users ));
    } catch (error) {
      reply.status(500).send(responseMappingError(500, error.message));
    }
}

/**
 * get all users onramp transactions
 * @controller admin
 * @route POST /api/v1/admin/getUserOnrampTransactions
 * @param {Object} request - The request object.
 * @param {Object} reply - The reply object.
 * @throws {Error} If an error occurs while logging in.
 */
export async function getUsersOnrampTransactions(request, reply) {
    try {
      const { limit = 10, skip = 0, sortField = "createdAt", sortOrder = "desc" } = request.query;
      let query = {
        limit: limit, // Number of records to fetch
        offset: skip, // Number of records to skip 
    };
      const transactions = await findAllRecord(OnRampTransaction,query)
      if (!transactions)
        return reply.status(404).send(responseMappingWithData(200, "Success", [] )); // generic error to prevent bruteforce
    
      return reply.status(200).send(responseMappingWithData(200, "Success", transactions ));
    } catch (error) {
      reply.status(500).send(responseMappingError(500, error.message));
    }
}
  
/**
 * get all users offramp transactions
 * @controller admin
 * @route POST /api/v1/admin/getUserOfframpTransactions
 * @param {Object} request - The request object.
 * @param {Object} reply - The reply object.
 * @throws {Error} If an error occurs while logging in.
 */
export async function getUsersOfframpTransactions(request, reply) {
    try {
      const transactions = await findAllRecord(OffRampTransaction)
      console.log(transactions);
      if (!transactions)
        return reply.status(404).send(responseMappingWithData(200, "Success", [] )); // generic error to prevent bruteforce
    
      return reply.status(200).send(responseMappingWithData(200, "Success", transactions ));
    } catch (error) {
      reply.status(500).send(responseMappingError(500, error.message));
    }
}

/**
 * get all users transactions
 * @controller admin
 * @route POST /api/v1/admin/getUserTransactions
 * @param {Object} request - The request object.
 * @param {Object} reply - The reply object.
 * @throws {Error} If an error occurs while logging in.
 */
export async function getUsersTransactions(request, reply) {
  try {
    // Extract pagination and sorting options from the request query or use defaults
    const { limit = 10, skip = 0, sortField = "createdAt", sortOrder = "desc" } = request.query;

    const options = {
      limit: parseInt(limit, 10),
      skip: parseInt(skip, 10),
      sortField,
      sortOrder,
    };

    // Query for fetching the transactions (excluding limit and skip)
    // const query = { where: { userId: request.params.userId } };
   
    const transactions = await findCombinedRecords(OffRampTransaction, OnRampTransaction, options);

    if (!transactions || transactions.length === 0) {
      return reply.status(404).send(responseMappingWithData(200, "Success", [])); // Generic response
    }

    return reply.status(200).send(responseMappingWithData(200, "Success", transactions));
  } catch (error) {
    reply.status(500).send(responseMappingError(500, error.message));
  }
}


  
/**
 * get all fees data
 * @controller admin
 * @route POST /api/v1/admin/getFees
 * @param {Object} request - The request object.
 * @param {Object} reply - The reply object.
 * @throws {Error} If an error occurs while logging in.
 */
export async function getFeesData(request, reply) {
    try {
      const fees = await getFee()
      console.log(fees);
      if (!fees)
      reply.status(500).send(responseMappingError(500, "No fees data found")); // generic error to prevent bruteforce
    
      return reply.status(200).send(responseMappingWithData(200, "Success", fees ));
    } catch (error) {
      reply.status(500).send(responseMappingError(500, error.message));
    }
}

/**
 * get all usdt rates
 * @controller admin
 * @route POST /api/v1/admin/getRates
 * @param {Object} request - The request object.
 * @param {Object} reply - The reply object.
 * @throws {Error} If an error occurs while logging in.
 */
export async function getRatesData(request, reply) {
  try {
    const rates = await findAllRecord(Usdt)
    console.log(rates);
    if (!rates)
    reply.status(500).send(responseMappingError(500, "No Rates data found")); // generic error to prevent bruteforce
  
    return reply.status(200).send(responseMappingWithData(200, "Success", rates ));
  } catch (error) {
    reply.status(500).send(responseMappingError(500, error.message));
  }
}

/**
 * updateFeesData
 * @controller admin
 * @route POST /api/v1/admin/getFees
 * @param {Object} request - The request object.
 * @param {Object} reply - The reply object.
 * @throws {Error} If an error occurs while logging in.
 */
export async function updateFeesAndRatesData(request, reply) {
    try {
      const details = request.body
      const fees = await getFee()
      console.log(fees);
      if (!fees)
      reply.status(500).send(responseMappingError(500, "No fees data found")); // generic error to prevent bruteforce
      const updated =  await  findOneAndUpdate(Fees,{id:1},details)
      const query={
         id:1
      }
      const updateObj ={
        inrRate:details.rates.inrRate,
        inrRateOfframp:details.rates.inrRateOfframp
      }
      const rateUpdated = await findOneAndUpdate(Usdt,query,updateObj)
      if(updated&&rateUpdated)
      return reply.status(200).send(responseMappingWithData(200, "Success", {updated ,rateUpdated}));
      else
      return reply.status(200).send(responseMappingError(400, "Failed to update fees data" ));
    } catch (error) {
      reply.status(500).send(responseMappingError(500, error.message));
    }
}
  