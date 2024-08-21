/**
 * Password Utility
 * @module utils/password
 * @category utils
 * @subcategory password
 * 
 * This file exports two functions for encrypting and comparing passwords using the `bcryptjs` library.
 * The `encrypt` function generates a salt and hashes the provided password.
 * The `compare` function compares a password with a hash and returns a boolean indicating if they match.
 */
import bcrypt from "bcryptjs";

/**
 * Encrypts the provided password.
 * @param {string} pass - Password to be encrypted.
 * @returns {string} - Encrypted password.
 * @async
 * @throws {Error} If an error occurs during the encryption process.
 * @example
 * const encryptedPassword = await encrypt("password");
 * console.log(encryptedPassword); // "$2a$10$Z8jZ1Z..."
 */
export const encrypt = async (pass) => {
    try {
        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(pass, salt);
        return hash;
    } catch (error) {
        throw new Error(`Encryption failed: ${error.message}`);
    }
};

/**
 * Compares a password with a hash.
 * @param {string} pass - Password to be compared.
 * @param {string} hash - Hash to be compared.
 * @returns {boolean} - Boolean indicating if the password and hash match.
 * @throws {Error} If an error occurs during the comparison process.
 * @async
 * @example
 * const result = await compare("password", "$2a$10$Z8jZ1Z...");
 * console.log(result); // true if the password and hash match, false otherwise
 */
export const compare = async (pass, hash) => {
    try {
        const result = await bcrypt.compare(pass, hash);
        return result;
    } catch (error) {
        throw new Error(`Comparison failed: ${error.message}`);
    }
};