/**
 * Common schemas that are used in multiple validators.
 * @file defines common schemas used in multiple validators
 * @module Common Validator
 * @category validators
 * @subcategory common
 */

const commonSchemas = {
    errorResponse: {
        400: {
            type: 'object',
            properties: {
                error: { type: 'string' },
                message: { type: 'string' },
                details: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            message: { type: 'string' },
                            param: { type: 'string' }
                        },
                    }
                }
            },
        },
        401: {
            type: 'object',
            properties: {
                error: { type: 'string' },
            },
        },
        // 402: {
        //     type: 'object',
        //     properties: {
        //         error: { type: 'string' },
        //     },
        // },
        403: {
            type: 'object',
            properties: {
                error: { type: 'string' },
            },
        },
        404: {
            type: 'object',
            properties: {
                error: { type: 'string' },
            },
        },
        500: {
            type: 'object',
            properties: {
                error: { type: 'string' },
            },
        },
        409: {
            type: 'object',
            properties: {
                error: { type: 'string' },
            },
        },
        429: {
            type: 'object',
            properties: {
                error: { type: 'string' },
            },
        },
    },
};

export default commonSchemas;