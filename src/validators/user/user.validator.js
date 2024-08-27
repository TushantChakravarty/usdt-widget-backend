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
            email_id: { type: 'string', minLength: 3, maxLength: 40 },
            phone_number: { type: 'string', minLength: 10, maxLength: 10 },
        },
        required: ['email_id',"phone_number"],
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
