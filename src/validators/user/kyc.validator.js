/**
 * Validators for user routes
 * @file user Validator
 * @module user Validator
 * @category validators
 * @subcategory user
 */

import commonSchemas from '../common.validator.js';

export const sendAadharOtp = {
    body: {
        type: 'object',
        properties: {
            aadhaarNumber:{ type: 'string', minLength: 12, maxLength: 12 }
        },
        required: ["aadhaarNumber"],
        additionalProperties: false,
    },

}
