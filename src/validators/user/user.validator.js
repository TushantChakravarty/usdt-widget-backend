/**
 * Validators for user routes
 * @file user Validator
 * @module user Validator
 * @category validators
 * @subcategory user
 */

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
    response: {
        200: {
            type: 'object',
            properties: {
                message: { type: 'string' },
                token: { type: 'string' },
            },
        },
        ...commonSchemas.errorResponse,
    },
};

export const signup = {
    body: {
        type: 'object',
        properties: {
            emailId: { type: 'string', minLength: 3, maxLength: 40 },
            password: { type: 'string', minLength: 8, maxLength: 56 },
        },
        required: ['emailId', 'password'],
        additionalProperties: false,
    },
    response: {
        200: {
            type: 'object',
            properties: {
                message: { type: 'string' },
            },
        },
        ...commonSchemas.errorResponse,
    },
}

export const profile = {
    body: {
        type: 'object',
        properties: {
            email_id: { type: 'string', minLength: 3, maxLength: 40 },
        },
        required: ['email_id'],
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

export const kycUrl = {
    body: {
        type: 'object',
        properties: {
            phone_number: { type: 'string', minLength: 10, maxLength: 10 },
        },
        required: ['phone_number'],
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

export const updatePhone = {
    body: {
        type: 'object',
        properties: {
            phone_number: { type: 'string', minLength: 10, maxLength: 15 },
        },
        required: ["phone_number"],
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


export const createOnramp = {
    body: {
        type: 'object',
        properties: {
            fromCurrency: { type: 'string', minLength: 1, maxLength: 10 },
            toCurrency: { type: 'string', minLength: 1, maxLength: 10 },
            chain: { type: 'string', minLength: 1, maxLength: 10 },
            paymentMethodType: { type: 'string', minLength: 1, maxLength: 10 },
            depositAddress: { type: 'string', minLength: 1 },
            fromAmount: { type: 'number', minimum: 1050 },
            toAmount: { type: 'number', minimum: 1 },
            rate: { type: 'number', minimum: 1 }
        },
        required: ["fromCurrency", "toCurrency", "chain", "paymentMethodType", "depositAddress", "fromAmount", "toAmount", "rate"],
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

export const getQuotes = {
    body: {
        type: 'object',
        properties: {
            fromCurrency: {
                type: "string",
                enum: ["INR"]
            },
            toCurrency: {
                type: "string",
                enum: ["USDT"]
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