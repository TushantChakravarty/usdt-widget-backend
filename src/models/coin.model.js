"use strict";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
    class Coin extends Model {
        static associate(models) {
            // Define association with Network
            Coin.hasMany(models.Network, {
                foreignKey: "coinid",
                as: "network",
            });
        }
    }

    Coin.init(
        {
            coin: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            coinid: {
                type: DataTypes.INTEGER,
                allowNull: true,
                unique: true,
               // primaryKey: true, // Ensure this is the primary key if needed
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
            tableName: "Coin",
            timestamps: false,
        }
    );

    return Coin;
};
