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
    class Admin extends Model {
        static associate(models) {
            // Admin.hasMany(models.FiatAccount, {
            //     foreignKey: "admin_id",
            //     as: "fiat_account",
            // });
        }
    }
    Admin.init(
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
            password: DataTypes.STRING, 
            token: {
                type: DataTypes.STRING,
                allowNull: true,
                unique: true,
            },
            role: {
                type: DataTypes.ENUM,
                values: ["master_admin", "admin"],
                allowNull: false,
                defaultValue: "admin",
            }, // role for access control
            signature: {
                type: DataTypes.STRING,
                allowNull: true,
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
            modelName: "admin",
            defaultScope: {
                attributes: { // removing password details at response times
                    exclude: ["password"],
                },
            },
            indexes: [{ unique: true, fields: ["email"] }],
        }
    );
    Admin.addScope("private", {
        attributes: {
            include: ["password"],
        },
    });
    return Admin;
};
