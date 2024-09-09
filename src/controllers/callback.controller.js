import db from "../models/index.js";

const { User, OnRampTransaction } = db;

/**
 * get otp callback kyc.
 * @controller user
 * @route POST /api/v1/callback/kyc
 * @param {Object} request - The request object.
 * @param {Object} reply - The reply object.
 * @throws {Error} If an error occurs while signing up.
 */
export async function callbackHandler(request, reply) {
    try {
        const details = request.body
        console.log(details)
        if (details.status === "OTP_COMPLETED") {
            let user = await User.scope("private").findOne({
                where: {
                    customerId: details.metadata.customerId,
                },
            });
            console.log("user",user)
            if (user) {
                // Update the otp field in the kyc object
                user.kyc = {
                    ...user.kyc,
                    otp: true,
                };
                console.log('updated check',user)
                
                // Save the updated user object
                const updated = await user.save();
                console.log('updated',updated)
                reply.status(200).send({ message: "success" });
            }else{
                reply.status(400).send({ error: "User not found" });
            }
        }
        if (details.status === "BASIC_KYC_COMPLETED") {
            let user = await User.scope("private").findOne({
                where: {
                    customerId: details.metadata.customerId,
                },
            });
            console.log("user",user)
            if (user) {
                // Update the otp field in the kyc object
                user.kyc = {
                    ...user.kyc,
                    basic: true,
                };
                console.log('updated check',user)
                
                // Save the updated user object
                const updated = await user.save();
                console.log('updated',updated)
                reply.status(200).send({ message: "success" });
            }else{
                reply.status(400).send({ error: "User not found" });
            }
        }
        if (details.status === "INTERMEDIATE_KYC_COMPLETED") {
            let user = await User.scope("private").findOne({
                where: {
                    customerId: details.metadata.customerId,
                },
            });
            console.log("user",user)
            if (user) {
                // Update the otp field in the kyc object
                user.kyc = {
                    ...user.kyc,
                    intermediate: true,
                };
                console.log('updated check',user)
                
                // Save the updated user object
                const updated = await user.save();
                console.log('updated',updated)
                reply.status(200).send({ message: "success" });
            }else{
                reply.status(400).send({ error: "User not found" });
            }
        }
        if (details.status === "ADVANCE_KYC_COMPLETED") {
            let user = await User.scope("private").findOne({
                where: {
                    customerId: details.metadata.customerId,
                },
            });
            console.log("user",user)
            if (user) {
                // Update the otp field in the kyc object
                user.kyc = {
                    ...user.kyc,
                    advanced: true,
                };
                console.log('updated check',user)
                
                // Save the updated user object
                const updated = await user.save();
                console.log('updated',updated)
                reply.status(200).send({ message: "success" });
            }else{
                reply.status(400).send({ error: "User not found" });
            }
        }
        if (details.status === "COMPLETED") {
            let user = await User.scope("private").findOne({
                where: {
                    customerId: details.metadata.customerId,
                },
            });
            console.log("user",user)
            if (user) {
                // Update the otp field in the kyc object
                user.isKycCompleted = true
                user.kyc = {
                    ...user.kyc,
                    completed: true,
                };
                console.log('updated check',user)
                
                // Save the updated user object
                const updated = await user.save();
                console.log('updated',updated)
                reply.status(200).send({ message: "success" });
            }else{
                reply.status(400).send({ error: "User not found" });
            }
        }
        if (details.status === "FIAT_DEPOSIT_RECEIVED") {
            let transaction = await OnRampTransaction.findOne({
                where: {
                    reference_id: details.referenceId,
                },
            });
            if (transaction) {
                // Update the status field in the transaction 
                transaction.status =details.status                
                // Save the updated transaction object
                const updated = await transaction.save();
                console.log('updated',updated)
                reply.status(200).send({ message: "success" });
            }else{
                reply.status(400).send({ error: "transaction not found" });
            }
        }
        if (details.status === "TRADE COMPLETED") {
            let transaction = await OnRampTransaction.findOne({
                where: {
                    reference_id: details.referenceId,
                },
            });
            if (transaction) {
                // Update the status field in the transaction 
                transaction.status =details.status                
                // Save the updated transaction object
                const updated = await transaction.save();
                console.log('updated',updated)
                reply.status(200).send({ message: "success" });
            }else{
                reply.status(400).send({ error: "transaction not found" });
            }
        }
        if (details.status === "ON_CHAIN_INITIATED") {
            let transaction = await OnRampTransaction.findOne({
                where: {
                    reference_id: details.referenceId,
                },
            });
            if (transaction) {
                // Update the status field in the transaction 
                transaction.status =details.status                
                // Save the updated transaction object
                const updated = await transaction.save();
                console.log('updated',updated)
                reply.status(200).send({ message: "success" });
            }else{
                reply.status(400).send({ error: "transaction not found" });
            }
        }
        if (details.status === "ON_CHAIN_COMPLETED") {
            let transaction = await OnRampTransaction.findOne({
                where: {
                    reference_id: details.referenceId,
                },
            });
            if (transaction) {
                // Update the status field in the transaction 
                transaction.status =details.status                
                // Save the updated transaction object
                const updated = await transaction.save();
                console.log('updated',updated)
                reply.status(200).send({ message: "success" });
            }else{
                reply.status(400).send({ error: "transaction not found" });
            }
        }
        if (details.status === "ON_CHAIN_COMPLETED") {
            let transaction = await OnRampTransaction.findOne({
                where: {
                    reference_id: details.referenceId,
                },
            });
            if (transaction) {
                // Update the status field in the transaction 
                transaction.status =details.status                
                // Save the updated transaction object
                const updated = await transaction.save();
                console.log('updated',updated)
                reply.status(200).send({ message: "success" });
            }else{
                reply.status(400).send({ error: "transaction not found" });
            }
        }
       
    } catch (error) {
        console.error("Error updating OTP status:", error);
        reply.status(500).send({ error: "Internal server error" });
    }
}

// /**
//  * callback for onramp transactionsa=
//  * @controller user
//  * @route POST /api/v1/callback/onramp
//  * @param {Object} request - The request object.
//  * @param {Object} reply - The reply object.
//  * @throws {Error} If an error occurs while signing up.
//  */
// export async function onrampCallback(request, reply) {
//     try {
//         const details = request.body
//         console.log(details)
      
//     } catch (error) {
//         console.error("Error updating onramp tx status:", error);
//         reply.status(500).send({ error: "Internal server error" });
//     }
// }