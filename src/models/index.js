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

import Sequelize from 'sequelize'
import config from '../config/database.js'
import User from "./user.model.js"
import Coin from './coin.model.js';

// 1. Import the model files

const db = {}
const sequelize = new Sequelize(config)

db.User = User(sequelize, Sequelize.DataTypes)
db.Coin = Coin(sequelize, Sequelize.DataTypes)


//Initialize models
const initializeModels = () => {
    console.log(`Imported ${Object.keys(db).length} models`)
    for (const modelName of Object.keys(db)) {
        console.log(`Associating ${modelName}`)
        if (db[modelName].associate) {
            db[modelName].associate(db)
        }
    }
};

initializeModels()

db.sequelize = sequelize
db.Sequelize = Sequelize
export default db