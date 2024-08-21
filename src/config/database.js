/**
 * Configuration object for the database connection.
 * Loads environment variables from the .env file.
 * @module config/database
 * @requires dotenv
 * @exports config
 * @type {Object}
 */

import dotenv from "dotenv"
dotenv.config() // load environment variables from .env file

export default {
  username: process.env.DB_USERNAME,
  password: process.env.DB_SECRET,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: "postgres",
  define: {
    underscored: true, // use underscore in table name
  },
  pool: { // Pool configuration
    max: 30, // Maximum number of connection in pool
    min: 0, // Minimum number of connection in pool
    acquire: 30000, // The maximum time, in milliseconds, that pool will try to get connection before throwing error
    idle: 5000 // The maximum time, in milliseconds, that a connection can be idle before being released
  },
  dialectOptions: {
    // dateStrings: true,
    useUTC: false, // for reading from database
    // typeCast: function (field, next) { // for reading from database
    //   if (field.type === 'DATETIME') {
    //     return field.string()
    //   }
    //   return next()
    // },
    timezone: "Asia/Kolkata", // for reading from database
  },
  timezone: "+05:30", // for writing to database
};
