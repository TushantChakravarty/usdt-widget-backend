import { compare } from "bcryptjs";
import { findAllRecord, findCombinedRecords, findOneAndUpdate, getFee } from "../Dao/dao.js";
import db from "../models/index.js";
import { encrypt } from "../utils/password.util.js";
import { responseMappingError, responseMapping, responseMappingWithData } from "../utils/responseMapper.js";

import { countTodayTransactions,successfullTxCount24hr, allOnrampTransactionCount, sumTodaySuccessTransactionsToAmount, sumTodaySuccessTransactionsFromAmount, sumYesterdaySuccessTransactionsToAmount, sumYesterdaySuccessTransactionsFromAmount, totalVolumeToAmount, totalVolumeFromAmount, sumTodaySuccessTransactionsOffRampToAmount, sumTodaySuccessTransactionsOffRampFromAmount, sumYesterdaySuccessTransactionsOfframpToAmount, sumYesterdaySuccessTransactionsOfframpFromAmount, allOfframpTransactionCount, countTodayTransactionsOfframp, successfullTxCount24hrofframp, totalVolumeOfframpToAmount, totalVolumeOfframpFromAmount} from "../services/metrics.service.js";

import { Sequelize } from "sequelize";
import { sendMail, sendMailSupport } from "../utils/mail/sendMail.js";
const { User, OnRampTransaction, OffRampTransaction, Payout, Admin, Fees, Usdt,sequelize,HelpAndSupport } = db;


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



export async function createTicket(request,reply){
  try{
    const { email,title , description} = request.body
    const created = await HelpAndSupport.create({
      email:email,
      title:title,
      description:description
    })
     const email_sent =  await sendMail("dev@gsxsolutions.com", 'Support', 'helpAndSupport', {
        title:title,
        description:description,
        email:email
      })

      if(!email_sent){
        return reply.status(500).send(responseMappingError(500, `Unable to raise your query , please try after some time`));
      }

      return reply.status(200).send(responseMappingWithData(200, "success", "Your query raised"));

  }catch(error){
    return reply.status(500).send(responseMappingError(500, `Internal server error`));
  }
}