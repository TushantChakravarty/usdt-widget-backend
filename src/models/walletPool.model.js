"use strict";
import { Model, UUIDV4 } from "sequelize";

export default (sequelize, DataTypes) => {
  class TronWalletPool extends Model {
    static associate(models) {
      // define association to user or transaction if needed
    }
  }

  TronWalletPool.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        primaryKey: true,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      privateKey: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      assignedToUserId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null, // not assigned initially
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: false, // set to true after activation (via 0.1 TRX etc.)
      },
      inUse: {
        type: DataTypes.BOOLEAN,
        defaultValue: false, // set to true once assigned
      },
      lastAssignedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "TronWalletPool",
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return TronWalletPool;
};
