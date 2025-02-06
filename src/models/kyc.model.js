"use strict";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
    class KYC extends Model {
        static associate(models) {
            // Define associations if necessary
        }
    }

    KYC.init(
        {
            userId:{
                type: DataTypes.INTEGER,
                allowNull: false
            },
            referenceID:{
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            decentroTxnId: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            status: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            responseCode: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            message: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            aadhaarReferenceNumber: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            aadharVerificationId:{
                type: DataTypes.STRING,
                allowNull: true,
            },
            proofOfIdentity: {
                type: DataTypes.JSON,
                allowNull: true,
            },
            proofOfAddress: {
                type: DataTypes.JSON,
                allowNull: true,
            },
            image: {
                type: DataTypes.TEXT, // Store Base64 image data as TEXT
                allowNull: true,
            },
            completed:{
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue:false
            },

        },
        {
            sequelize,
            modelName: "KYC",
            tableName: "KYC",
            timestamps: true,
            createdAt: "date",
            updatedAt: "time",
        }
    );

    return KYC;
};
