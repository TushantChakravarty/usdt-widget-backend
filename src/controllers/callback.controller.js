import db from "../models/index.js";

const { User } = db;

/**
 * get otp callback kyc.
 * @controller user
 * @route POST /api/v1/callback/kyc
 * @param {Object} request - The request object.
 * @param {Object} reply - The reply object.
 * @throws {Error} If an error occurs while signing up.
 */
export async function kycCallback(request, reply) {
    try {
        const details = console.log(request.body);
        if (details.status === "OTP_COMPLETED") {
            let user = await User.scope("private").findOne({
                where: {
                    customerId: details.metadata.customerId,
                },
            });
    
            if (user) {
                // Update the otp field in the kyc object
                user.kyc = {
                    ...user.kyc,
                    otp: true,
                };
    
                // Save the updated user object
                const updated = await user.save();
                console.log(updated)
                reply.status(200).send({ message: "success" });
            }else{
                reply.status(400).send({ error: "User not found" });
            }
        }
    } catch (error) {
        console.error("Error updating OTP status:", error);
        reply.status(500).send({ error: "Internal server error" });
    }
}