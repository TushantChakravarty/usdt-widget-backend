"use strict";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
    class Payin extends Model {
        static associate(models) {
            // define association here
            // Payin.belongsTo(models.OnRampTransaction, {
            //     foreignKey: "reference_id",
            //     targetKey: "reference_id", // match the target key
            //     onDelete: "CASCADE",  // Optional: cascade deletes if the transaction is deleted
            // });
        }
    }

    Payin.init(
        {
            
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
                type: DataTypes.STRING,
                allowNull: true,
                defaultValue:"PENDING"
            },
            utr:{
                type: DataTypes.STRING,
                allowNull: true,
            }
        },
        {
            sequelize,
            modelName: "Payin",
            timestamps: true,
            createdAt: 'date',  // Rename createdAt to 'date'
            updatedAt: 'time',  // Rename updatedAt to 'time'
        }
    );

    return Payin;
};
