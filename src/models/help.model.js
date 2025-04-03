"use strict";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
    class HelpAndSupport extends Model {
        static associate(models) {
            // Define associations if necessary
        }
    }

    HelpAndSupport.init(
        {
            email:{
              type :DataTypes.STRING,
            },
            title:{
              type :DataTypes.STRING,
            },
            description:{
              type :DataTypes.TEXT,
            }
        },
        {
            sequelize,
            modelName: "HelpAndSupport",
            tableName: "HelpAndSupport",
            timestamps: true,
            createdAt: "date",
            updatedAt: "time",
        }
    );

    return HelpAndSupport;
};
