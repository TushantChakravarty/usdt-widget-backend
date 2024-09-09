"use strict";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
    class Network extends Model {
        static associate(models) {
            // Associate Network with Coin
            Network.belongsTo(models.Coin, {
                foreignKey: "coinid",
                as: "Coin",
            });
        }
    }

    Network.init(
        {
            networkId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            coinid: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: "Coin",
                    key: "coinid",
                },
                
            },
            withdrawalFee: {
                type: DataTypes.DECIMAL(20, 10),
                allowNull: false,
            },
            minimumWithdrawal: {
                type: DataTypes.DECIMAL(20, 10),
                allowNull: false,
            },
            nodeInSync: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
            },
            depositEnable: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "Network",
            tableName: "Network",
            timestamps: false,
        }
    );

    return Network;
};
