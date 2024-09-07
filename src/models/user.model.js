/**
 * User model
 * Represents a User entity in the database
 * @module models/user
 * @requires sequelize
 * @requires sequelize/Model
 * @exports User
 * @class User
 */

"use strict";
import { Model } from "sequelize";
// import fs from "fs";

export default (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {
        }
    }
    User.init(
        {
            // email unique. username unique. phone unique.
            email: {
                type: DataTypes.STRING,
                allowNull: true,
                unique: true,
                validate: {
                    isEmail: true,
                },
            },
            password: DataTypes.STRING, // hashed. only for admins, normal users will be logged in via otp
            customerId: {
                type: DataTypes.STRING,
                allowNull: true,
                unique: true,
            },
            phone: {
                type: DataTypes.STRING,
                allowNull: true,
                unique: true,
            },
            token: {
                type: DataTypes.STRING,
                allowNull: true,
                unique: true,
            },
            role: {
                type: DataTypes.ENUM,
                values: ["user", "admin"],
                allowNull: false,
                defaultValue: "user",
            }, // role for access control
            isKycCompleted: {
                type: DataTypes.BOOLEAN,
                defaultValue: false
            },
            isPhoneAdded: {
                type: DataTypes.BOOLEAN,
                defaultValue: false
            },
            signature: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            kycUrl: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            phone_number: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            kyc: {
                type: DataTypes.JSONB, // or DataTypes.JSON if you don't need PostgreSQL-specific functionality
                allowNull: false,
                defaultValue: {
                    otp: false,
                    basic: false,
                    video:false,
                    advanced:false,
                    intermediate:false,
                    sta:false
                },
            },

        },
        {
            hooks: {
                afterCreate: async (user, options) => {
                },
                beforeDestroy: async (user, options) => {


                },
            },
            sequelize,
            modelName: "User",
            defaultScope: {
                attributes: { // removing password details at response times
                    exclude: ["password"],
                },
            },
            indexes: [{ unique: true, fields: ["email"] }],
        }
    );
    User.addScope("private", {
        attributes: {
            include: ["password"],
        },
    });
    return User;
};
