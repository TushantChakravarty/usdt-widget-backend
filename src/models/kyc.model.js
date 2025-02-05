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
            name: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            dob: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            gender: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            mobileNumber: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            careOf: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            country: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            district: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            house: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            landmark: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            locality: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            pincode: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            postOffice: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            state: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            street: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            subDistrict: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            vtc: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            image: {
                type: DataTypes.TEXT, // Base64 image data
                allowNull: true,
            },
            aadhaarZip: {
                type: DataTypes.TEXT, // Base64 encoded zip file
                allowNull: true,
            },
            shareCode: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            pdf: {
                type: DataTypes.TEXT, // Base64 encoded PDF
                allowNull: true,
            }
        },
        {
            sequelize,
            modelName: "KYC",
            timestamps: true,
            createdAt: "date",
            updatedAt: "time",
        }
    );

    return KYC;
};
