"use strict";
import { Model, UUIDV4 } from "sequelize";

export default (sequelize, DataTypes) => {
    class OffRampTransaction extends Model {
        static associate(models) {
            // define association here if needed
        }
    }

    OffRampTransaction.init(
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
            status:{
                type: DataTypes.STRING,
                allowNull: true,
                defaultValue:"PENDING"
            },
            chain: {
                type: DataTypes.STRING,
                allowNull: false
            },
            fiatAccountId: {
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
        },
        {
            sequelize,
            modelName: "OffRampTransaction",
            timestamps: true,
            createdAt: 'date',  // Rename createdAt to 'date'
            updatedAt: 'time',  // Rename updatedAt to 'time'
            // timestamps: false, // if you don't need timestamps
        }
    );

    return OffRampTransaction;
};
