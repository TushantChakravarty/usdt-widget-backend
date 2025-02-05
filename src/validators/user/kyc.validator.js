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
