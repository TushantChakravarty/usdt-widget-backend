/**
 * Referral utility functions
 * Utility functions for generating unique referral codes.
 * @module utils/referral
 * @requires db/models
 * @category utils
 * @subcategory referral
 */

import db from "../models"

const { User } = db;

/**
 * Generates a random referral code of the specified length.
 * @param {number} length - Length of the referral code to be generated.
 * @returns {string} - Generated referral code.
 * @example
 * const referral_code = generateRandomCode(8);
 * console.log(referral_code); // "ABC12345"
 * @example
 * const referral_code = generateRandomCode(10);
 * console.log(referral_code); // "ABC12345EF"
 */
function generateRandomCode(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let referral_code = '';

    for (let i = 0; i < length; i++) {
        referral_code += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return referral_code;
}

/**
 * Generates a unique referral code.
 * @returns {string} - Generated unique referral code.
 * @example
 * const referral_code = await generateUniqueReferralCode();
 * console.log(referral_code); // "ABC12345"
 * @example
 * const referral_code = await generateUniqueReferralCode();
 * console.log(referral_code); // "ABC12345EF"
 */
export async function generateUniqueReferralCode() {
    try {
        let referral_code = generateRandomCode(8);

        // Check if the generated code already exists in the database
        let existingReferral = await User.findOne({
            where: { referral_code: referral_code }
        });

        // Loop until a unique referral code is generated
        while (existingReferral) {
            referral_code = generateRandomCode(8);
            existingReferral = await User.findOne({
                where: { referral_code: referral_code }
            });
        }

        return referral_code;

    } catch (err) {

    }

}
