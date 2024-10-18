"use strict";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
    class FiatAccount extends Model {
        static associate(models) {
            // Associate FiatAccount with User
            FiatAccount.belongsTo(models.User, {
                foreignKey: "user_id",
                as: "user",
            });
        }
    }

    FiatAccount.init(
        {
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            account_name:{
                type: DataTypes.STRING,
                allowNull: true,
            },
            fiatAccountId: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            fiatAccount: {
                type: DataTypes.STRING
            },
            ifsc: {
                type: DataTypes.STRING,
            },
            bank_name: {
                type: DataTypes.STRING,
            },
            delete:{
                type: DataTypes.BOOLEAN,
                allowNull:true,
                defaultValue:false
            }
        },
        {
            sequelize,
            modelName: "FiatAccount",
            tableName: "FiatAccount",
            // timestamps: false,
        }
    );

    return FiatAccount;
};
