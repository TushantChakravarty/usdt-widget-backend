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
            otp:{ type: 'string', minLength: 4, maxLength: 4 },
            password: { type: 'string', minLength: 8, maxLength: 56 },
        },
        required: ['emailId','otp', 'password'],
        additionalProperties: false,
    }
}
export const signupOtp = {
    querystring: {
        type: 'object',
        properties: {
            email: { type: 'string', format:"email",minLength:5, maxLength: 40 },
        },
        required: ['email'],
        additionalProperties: false,
    }
}


export const changePassword = {
    body: {
        type: 'object',
        properties: {
            newPassword: { type: 'string', minLength: 8, maxLength: 40,  pattern: '^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,40}$',},
            oldPassword: { type: 'string', minLength: 8, maxLength: 56, pattern: '^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,40}$', },
        },
        required: ['newPassword', 'oldPassword'],
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
            fromAmount: { type: 'number', minimum: 0 },
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
                enum: ["INR","USDT"]
            },
            toCurrency: {
                type: "string",
                enum: ["USDT","INR"],
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


export const forgetPassword ={
    querystring: {
        type: 'object',
        properties: {
            email: {
                type: "string", format: 'email'}
        },
        required: ["email"],
        additionalProperties: false,
    },

}

export const changeForgetPassword = {
    body:{
        type: 'object',
        properties: {
            email: {type: "string", format: 'email'},
            otp: { type: 'string', minLength: 4, maxLength: 4 },
            newPassword: { 
                type: 'string', 
                minLength: 8, 
                maxLength: 40,
                pattern: '^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,40}$',
                // errorMessage: {
                //     pattern: 'Password must contain at least one uppercase letter, one number, and one special symbol (!@#$%^&*).',
                //     minLength: 'Password should be at least 8 characters long.',
                //     maxLength: 'Password should not exceed 40 characters.'
                //   }
              }
        },
        required: ["email","otp","newPassword"],
        additionalProperties: false,
    },
}

// export const changeForgetPassword = {
//     body: {
//       type: 'object',
//       properties: {
//         email: { type: "string", format: 'email' },
//         otp: { type: 'string', minLength: 4, maxLength: 4 },
//         newPassword: {
//           type: 'string',
//           minLength: 8,
//           maxLength: 40,
//           pattern: '^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,40}$',
//           errorMessage: {
//             pattern: 'Password must contain at least one uppercase letter, one number, and one special symbol (!@#$%^&*).',
//             minLength: 'Password should be at least 8 characters long.',
//             maxLength: 'Password should not exceed 40 characters.'
//           }
//         }
//       },
//       required: ["email", "otp", "newPassword"],
//       additionalProperties: false,
//       errorMessage: {
//         required: {
//           email: "Email is required",
//           otp: "OTP is required",
//           newPassword: "New password is required"
//         },
//         properties: {
//           email: "Please provide a valid email address",
//           otp: "OTP must be a 4-digit string",
//           newPassword: "Please provide a valid password"
//         },
//         additionalProperties: "No additional properties are allowed"
//       }
//     }
//   };