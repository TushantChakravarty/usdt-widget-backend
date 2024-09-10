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

// Initialize the Sequelize instance
const sequelize = new Sequelize(config);

const db = {
    User: User(sequelize, Sequelize.DataTypes),
    Coin: Coin(sequelize, Sequelize.DataTypes),
    OnRampTransaction: OnRampTransaction(sequelize, Sequelize.DataTypes),
    Network: Network(sequelize, Sequelize.DataTypes),
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
