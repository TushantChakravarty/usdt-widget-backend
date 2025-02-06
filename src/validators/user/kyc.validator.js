/**
 * Validators for user routes
 * @file Kyc Validator
 * @module kyc Validator
 * @category validators
 * @subcategory kyc
 */

import commonSchemas from '../common.validator.js';

export const sendAadharOtp = {
    body: {
        type: 'object',
        properties: {
            aadharNumber:{ type: 'string', minLength: 12, maxLength: 12 }
        },
        required: ["aadharNumber"],
        additionalProperties: false,
    },

}

export const verifyAadharOtp = {
    body: {
        type: 'object',
        properties: {
            referenceId:{ type: 'string', minLength: 10, maxLength: 12 },
            otp:{ type: 'string', minLength: 1, maxLength: 6 }
        },
        required: ["referenceId","otp"],
        additionalProperties: false,
    },

}
