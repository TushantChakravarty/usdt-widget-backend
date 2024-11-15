/**
 * Validators for user routes
 * @file user Validator
 * @module user Validator
 * @category validators
 * @subcategory user
 */

import { format } from 'sequelize/lib/utils';
import commonSchemas from '../common.validator.js';

export const login = {
    body: {
        type: 'object',
        properties: {
            emailId: { type: 'string', minLength: 3, maxLength: 40 },
            password: { type: 'string', minLength: 8, maxLength: 56 },
        },
        required: ['emailId', 'password'],
    },
    // response: {
    //     200: {
    //         type: 'object',
    //         properties: {
    //             message: { type: 'string' },
    //             token: { type: 'string' },
    //         },
    //     },
       
    // },
};

export const signup = {
    body: {
        type: 'object',
        properties: {
            emailId: { type: 'string', minLength: 3, maxLength: 40 },
            password: { type: 'string', minLength: 8, maxLength: 56 },
        },
        required: ['emailId','password'],
        additionalProperties: false,
    }
}

export const updateFeeSchema = {
    body: {
        type: 'object',
        properties: {
            onrampFee: { type: 'object' },
            offrampFee: { type: 'object' },
        },
        additionalProperties: false,
        anyOf: [
            { required: ['onrampFee'] },
            { required: ['offrampFee'] },
        ],
    },
};

