import db from "../models";
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