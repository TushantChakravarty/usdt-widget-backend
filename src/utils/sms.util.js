/**
 * SMS Util
 * @module utils/sms.util
 * @category utils
 * @subcategory sms
 * @requires node-fetch
 * @requires dotenv
 */
import fetch from "node-fetch"
import { logger } from "../app.js"

/**
 * Sends an SMS message to the specified numbers.
 * @param {string[]} numbers - Array of numbers to send the SMS to.
 * @param {string} message - The message to send.
 * @returns {Promise<Response>} The response from the SMS API.
 * @throws {Error} If there is an error while sending the SMS.
 * @example
 * const response = await sendSms(["+919876543210"], "Hello World!");
 */
export const sendSms = async (numbers, message) => {
    try {
        const mobile_numbers = numbers.join(",") // numbers is an array of numbers, send mobileno as comma separated string
        const uri_message = encodeURI(message) // encode message to URL format
        // const url = `${process.env.SMS_API_URL}?authkey=${process.env.SMS_API_KEY}&mobiles=${mobile_numbers}&message=${uri_message}&sender=${process.env.SMS_HEADER}&route=2&country=0&DLT_TE_ID=1707168499016611106`
        const url = `http://sms.ibittechnologies.in/api/sendhttp.php?authkey=${process.env.SMS_KEY}&mobiles=${mobile_numbers}&message=${uri_message}&sender=IBITTS&route=2&country=0&DLT_TE_ID=1707168499016611106`
        const response = await fetch(url)

        // if response is not 200, throw error
        if (!response.ok) {
            const errorText = await response.text()
            logger.error(`sendSms failed: ${errorText}`)
            throw new Error("sendSms failed")
        }

        return response
    } catch (error) {
        logger.error(`sendSms failed: ${error}`)
        throw new Error("sendSms failed")
    }
}
