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
            fromAmount: { type: 'number' },
            toAmount: { type: 'number' },
            rate: { type: 'number' },
            // userWalletAddress: { 
            //     type: 'string', 
            //     minLength: 34, 
            //     maxLength: 34,
            //     pattern: "^T[a-zA-Z0-9]{33}$" // Ensures it starts with "T" and has 34 characters
            // },
        },
        required: ["fromCurrency", "toCurrency", "chain", "fiatAccountId", "fromAmount", "toAmount", "rate"],
        additionalProperties: true,
    },
}

export const quitSession = {
    body: {
        type: 'object',
        properties: {
            reference_id: { type: 'string', minLength: 1, maxLength: 20 },
            depositAddress: { type: 'string', minLength: 1 },
           
        },
        required: ["reference_id", "depositAddress"],
        additionalProperties: true,
    },
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

export const validateFiatAccount = {
    body: {
        type: 'object',
        properties: {
            fiatAccount: { type: 'string', minLength: 1, maxLength: 80 },
            ifsc: { type: 'string', minLength: 1, maxLength: 16 },
           

        },
        required: ["fiatAccount", "ifsc"],
        additionalProperties: false,
    }
}

export const addFiatAccount = {
    body: {
        type: 'object',
        properties: {
            fiatAccount: { type: 'string', minLength: 1, maxLength: 80 },
            ifsc: { type: 'string', minLength: 1, maxLength: 16 },
            bankName: { type: 'string', minLength: 1, maxLength: 80 },
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


export const transactionStatus = {
    body: {
        type: 'object',
        properties: {
            transactionId: {
                type: "string", 
            },
        },
        required: ["transactionId"],
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