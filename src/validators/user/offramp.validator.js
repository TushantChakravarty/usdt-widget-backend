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

export const verifyTransaction = {
    body: {
        type: 'object',
        properties: {
            fromCurrency: { type: 'string', minLength: 1, maxLength: 10 },
            toCurrency: { type: 'string', minLength: 1, maxLength: 10 },
            chain: { type: 'string', minLength: 1, maxLength: 10 },
            fromAmount: { type: 'number', },
            txHash :{ type: 'string'},
            reference_id: {type: 'number'}
        },
        required: ["fromCurrency", "toCurrency", "chain",  "fromAmount", "txHash", "reference_id"],
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
            fiatAccount: { type: 'string', minLength: 1, maxLength: 20 },
            ifsc: { type: 'string', minLength: 1, maxLength: 16 },
            bankName: { type: 'string', minLength: 1, maxLength: 20 },
            accountName :{type:'string'}

        },
        required: ["fiatAccount", "ifsc", "bankName", "accountName"],
        additionalProperties: false,
    }
}


export const deleteFiatAccount = {
    params: {
        type: 'object',
        properties: {
            id: { type: 'integer' },
        },
        required: ['id'],
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
            // paymentMethodType: { type: 'string', minLength: 1, maxLength: 10 },
            fromAmount: { type: 'number', minimum: 0 }
        },
        required: ["fromCurrency", "toCurrency", "chain", "fromAmount"],
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

export const offrampRetry = {
    body: {
        type: 'object',
        properties: {
            transactionId: {
                type: "string",
               
            },
            sentFiatAccount: {
                type: "boolean",
               
            },
            newBank: {  type: "boolean" },
            fiatAccountId: {
                type: "number",
            },
            fiatAccount: {
                type: "number",
            },
            bankName: {
                type: "string",
               
            },
            ifsc: {
                type: "string",
               
            },
            accountName: {
                type: "string",
               
            },
            // paymentMethodType: { type: 'string', minLength: 1, maxLength: 10 },
        },
        required: ["transactionId", "sentFiatAccount", "newBank"],
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