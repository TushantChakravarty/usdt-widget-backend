import db from "../models";
import logger from "./logger.util";

/**
 * Util for migrating db
 */
export default async function migrateDb() {
    db.sequelize
        .sync({ alter: true })
        .then(async () => {
            console.log("Database connected")
            logger.info("Database connected")
        })
        .catch((err) => {
            console.log("Unable to connect to the database: ", err)
        });
}