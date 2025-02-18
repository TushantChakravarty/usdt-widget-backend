/**
 * Database configuration and model initialization.
 * Imports and associates all the models with the Sequelize instance.
 * @module models/index
 * @requires sequelize
 * @requires sequelize/Model
 * @requires models/*
 * @exports db
 */

'use strict';

import Sequelize from 'sequelize';
import config from '../config/database.js';
import User from './user.model.js';
import Coin from './coin.model.js';
import OnRampTransaction from './onramp.model.js';
import Network from './network.model.js';
import Usdt from './usdtRate.model.js';
import OffRampTransaction from "./offramp.model.js"
import FiatAccount from "./fiat.account.model.js"
import Otp from "./otp.model.js"
import payoutModel from './payout.model.js';
import payinModel from './payin.model.js';

import adminModel from './admin.model.js';
import feesModel from './fees.model.js';
import kycModel from './kyc.model.js';
import ValidatedAccounts from './validatedAccounts.model.js';

// Initialize the Sequelize instance
const sequelize = new Sequelize(config);

let db = {
    User: User(sequelize, Sequelize.DataTypes),
    Coin: Coin(sequelize, Sequelize.DataTypes),
    OnRampTransaction: OnRampTransaction(sequelize, Sequelize.DataTypes),
    Network: Network(sequelize, Sequelize.DataTypes),
    FiatAccount: FiatAccount(sequelize, Sequelize.DataTypes),
    Usdt: Usdt(sequelize, Sequelize.DataTypes),
    OffRampTransaction: OffRampTransaction(sequelize, Sequelize.DataTypes),
    Otp:Otp(sequelize,Sequelize.DataTypes),
    Payout:payoutModel(sequelize,Sequelize.DataTypes),
    Payin:payinModel(sequelize,Sequelize.DataTypes),
    Admin:adminModel(sequelize,Sequelize.DataTypes),
    Fees:feesModel(sequelize,Sequelize.DataTypes),
    Kyc:kycModel(sequelize,Sequelize.DataTypes),
    ValidatedAccounts:ValidatedAccounts(sequelize,Sequelize.DataTypes),


};

// Initialize model associations
const initializeModels = () => {
    console.log(`Imported ${Object.keys(db).length} models`);
    for (const modelName of Object.keys(db)) {
        console.log(`Associating ${modelName}`);
        if (db[modelName].associate) {
            db[modelName].associate(db);
        }
    }
};

initializeModels();

// Sync database
// sequelize.sync({ force: true }).then(() => {
//     console.log("Database synced");
// }).catch((error) => {
//     console.error("Error syncing database:", error);
// });


db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
