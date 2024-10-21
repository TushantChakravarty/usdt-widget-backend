"use strict";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
    class Payout extends Model {
        static associate(models) {
            // define association here
            Payout.belongsTo(models.OffRampTransaction, {
                foreignKey: "reference_id",
                targetKey: "reference_id", // match the target key
                onDelete: "CASCADE",  // Optional: cascade deletes if the transaction is deleted
            });
        }
    }

    Payout.init(
        {
            reference_id: {
                type: DataTypes.STRING,
                allowNull: false,
                references: {
                    model: 'off_ramp_transactions', // should match the name in OffRampTransaction
                    key: 'reference_id',
                }
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false
            },
            phone: {
                type: DataTypes.STRING,
                allowNull: false
            },
            amount: {
                type: DataTypes.FLOAT,
                allowNull: false
            },
            account_number: {
                type: DataTypes.STRING,
                allowNull: false
            },
            ifsc: {
                type: DataTypes.STRING,
                allowNull: false
            },
            bank_name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            method: {
                type: DataTypes.STRING,
                allowNull: false
            },
            customer_id: {
                type: DataTypes.STRING,
                allowNull: false
            },
            transaction_id: {
                type: DataTypes.STRING,
                allowNull: false
            },
            user_id:{
                type: DataTypes.STRING,
                allowNull: false
            },
            txHash:{
                type: DataTypes.STRING,
                allowNull: true
            },
            status:{
                type: DataTypes.BOOLEAN,
                allowNull: true,
                defaultValue:false
            }
        },
        {
            sequelize,
            modelName: "Payout",
            timestamps: true,
            createdAt: 'date',  // Rename createdAt to 'date'
            updatedAt: 'time',  // Rename updatedAt to 'time'
        }
    );

    return Payout;
};
