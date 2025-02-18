"use strict";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
    class ValidatedAccounts extends Model {
        static associate(models) {
            // Associate FiatAccount with User
           
        }
    }

    ValidatedAccounts.init(
        {
            fiatAccount: {
                type: DataTypes.STRING
            },
            ifsc: {
                type: DataTypes.STRING,
            },
          
        },
        {
            sequelize,
            modelName: "ValidatedAccounts",
            tableName: "ValidatedAccounts",
            // timestamps: false,
        }
    );

    return ValidatedAccounts;
};
