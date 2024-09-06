"use strict";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
    class Coin extends Model {
        static associate(models) {
            // define association here if needed
        }
    }

    Coin.init(
        {
            coin: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            coinId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                unique: true,
            },
            coinIcon: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            coinName: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            balanceFloatPlaces: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "Coin",
            timestamps: false, // if you don't need timestamps
        }
    );

    return Coin;
};
