/**
 * Otp model definition.
 * Represents an OTP (One-Time Password) entity in the database.
 * @module models/otp
 * @requires sequelize
 * @requires sequelize/Model
 * @exports Otp
 * @class Otp
 */

"use strict";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
    class Otp extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    Otp.init(
        {
            otp: { type: DataTypes.STRING, allowNull: false }, // req otp
            email: { type: DataTypes.STRING, allowNull: false }, // req phone
            sent_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            }, // req last sent at
        },
        {
            sequelize,
            modelName: "Otp",
        }
    );
    return Otp;
};
