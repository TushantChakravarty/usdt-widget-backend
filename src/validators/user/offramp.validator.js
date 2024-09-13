/**
 * Validators for user routes
 * @file user Validator
 * @module user Validator
 * @category validators
 * @subcategory user
 */

import commonSchemas from '../common.validator.js';

export const createOfframp = {
    body: {
        type: 'object',
        properties: {
            fromCurrency: { type: 'string', minLength: 1, maxLength: 10 },
            toCurrency: { type: 'string', minLength: 1, maxLength: 10 },
            chain: { type: 'string', minLength: 1, maxLength: 10 },
            fiatAccountId: { type: 'string', minLength: 1 },
            fromAmount: { type: 'number', },
            toAmount: { type: 'number', },
            rate: { type: 'number' },
            customerId:{ type: 'string'}, 
            paymentMethodType: {type: 'string'}, 
            depositAddress:{ type: 'string'}
        },
        required: ["fromCurrency", "toCurrency", "chain", "fiatAccountId", "fromAmount", "toAmount", "rate"],
        additionalProperties: false,
    },
    // response: {
    //     200: {
    //         type: 'object',
    //         properties: {
    //             message: { type: 'string' },
    //         },
    //     },
    //     ...commonSchemas.errorResponse,
    // },
}


export const addFiatAccount = {
    body: {
        type: 'object',
        properties: {
            fiatAccount: { type: 'string', minLength: 1, maxLength: 10 },
            ifsc: { type: 'string', minLength: 1, maxLength: 10 },
        },
        required: ["fiatAccount", "ifsc"],
        additionalProperties: false,
    }
}


export const getQuotesOfframp = {
    body: {
        type: 'object',
        properties: {
            fromCurrency: {
                type: "string",
                enum: ["USDT"]
            },
            toCurrency: {
                type: "string",
                enum: ["INR"]
            },
            chain: { type: 'string', minLength: 1, maxLength: 10 },
            paymentMethodType: { type: 'string', minLength: 1, maxLength: 10 },
            fromAmount: { type: 'number', minimum: 0 }
        },
        required: ["fromCurrency", "toCurrency", "chain", "paymentMethodType", "fromAmount"],
        additionalProperties: false,
    },
    // response: {
    //     200: {
    //         type: 'object',
    //         properties: {
    //             message: { type: 'string' },
    //         },
    //     },
    //     ...commonSchemas.errorResponse,
    // },
}