"use strict";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
    class Fee extends Model {
        static associate(models) {
            // Define associations here if needed
        }
    }

    Fee.init(
        {
            // Onramp Fee
            onrampFee: {
                type: DataTypes.JSON,
                allowNull: false,
                defaultValue: {
                    platformFee: 0, // Default value
                },
            },

            // Offramp Fee
            offrampFee: {
                type: DataTypes.JSON,
                allowNull: false,
                defaultValue: {
                    offrampFeePercentage: 0,
                    gatewayFeePercentage: 0,
                    tdsFeePercentage: 0,
                },
            },
        },
        {
            hooks: {
                beforeCreate: async (fee, options) => {
                    // Ensure only one record exists
                    const existing = await Fee.findOne();
                    if (existing) {
                        throw new Error("Only one Fee record is allowed. Update the existing record instead.");
                    }
                },
            },
            sequelize,
            modelName: "fee",
        }
    );

    return Fee;
};
