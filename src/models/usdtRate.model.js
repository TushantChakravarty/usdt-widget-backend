"use strict";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
    class USDT extends Model {
        static associate(models) {
           
        }
    }

    USDT.init(
        {
            inrRate: {
                type: DataTypes.FLOAT,
                allowNull: true,
                defaultValue:92
            },
            inrRateOfframp: {
                type: DataTypes.FLOAT,
                allowNull: true,
                defaultValue:85
            },
        },
        {
            sequelize,
            modelName: "USDT",
            tableName: "usdt",
            timestamps: true,
        }
    );

    return USDT;
};
