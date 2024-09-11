"use strict";
import { Model, UUIDV4 } from "sequelize";

export default (sequelize, DataTypes) => {
    class OnRampTransaction extends Model {
        static associate(models) {
            // define association here if needed
        }
    }

    OnRampTransaction.init(
        {
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            reference_id: {
                type: DataTypes.STRING,
                allowNull: false
            },
            transaction_id: {
                type: DataTypes.UUID,
                defaultValue: UUIDV4,
                allowNull: false,
                unique: true
            },
            fromCurrency: {
                type: DataTypes.STRING,
                allowNull: false
            },
            toCurrency: {
                type: DataTypes.STRING,
                allowNull: false
            },
            chain: {
                type: DataTypes.STRING,
                allowNull: false
            },
            paymentMethodType: {
                type: DataTypes.STRING,
                allowNull: false
            },
            depositAddress: {
                type: DataTypes.STRING,
                allowNull: false
            },
            customerId: {
                type: DataTypes.STRING,
                allowNull: false
            },
            fromAmount: {
                type: DataTypes.FLOAT,
                allowNull: false
            },
            toAmount: {
                type: DataTypes.FLOAT,
                allowNull: false
            },
            rate: {
                type: DataTypes.FLOAT,
                allowNull: false
            },
            status: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: 'PENDING'
            },
        },
        {
            sequelize,
            modelName: "OnRampTransaction",
            timestamps: true,
            createdAt: 'date',  // Rename createdAt to 'date'
            updatedAt: 'time',  // Rename updatedAt to 'time'
        }
    );

    return OnRampTransaction;
};
