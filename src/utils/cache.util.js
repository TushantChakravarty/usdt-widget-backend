/**
 * Node.js cache object
 * @module utils/cache.util
 * @category utils
 * @subcategory cache
 * @requires redis
 * 
 */
import { server } from "../app.js"
import logger from "./logger.util.js";
import { EventEmitter } from 'events';

const eventEmitter = new EventEmitter();

/**
 * Using Redis as cache store now instead of node-cache
 */
const cache = {
    async get(key) {
        try {
            key = `${process.env.APP_PORT}_${key}`; // prepend process.env.APP_PORT to the key
            const cachedData = await server.redis.get(key);
            if (cachedData) {
                console.log(`Cache found for ${key} with data ${cachedData}`);
                return JSON.parse(cachedData);
            }
            return null;
        } catch (error) {
            console.log(error);
            logger.error(`cache.util.get error: ${error}`);
        }
    },

    async set(key, value, duration) {
        try {
            key = `${process.env.APP_PORT}_${key}`; // prepend process.env.APP_PORT to the key
            const data = JSON.stringify(value);
            await server.redis.set(key, data, "EX", duration);
            console.log(`Cache set for ${key} with duration ${duration}`);

            // Emitting an event after setting the cache
            eventEmitter.emit('set', key, value, duration);

            return true;
        } catch (error) {
            console.log(error);
            logger.error(`cache.util.set error: ${error}`);
            return false;
        }
    },

    async del(key) {
        try {
            key = `${process.env.APP_PORT}_${key}`; // prepend process.env.APP_PORT to the key
            console.log(`Cache del for ${key}`);
            await server.redis.del(key);

            // Emitting an event after deleting from cache
            eventEmitter.emit('del', key);

            return true;
        } catch (error) {
            console.log(error);
            logger.error(`cache.util.del error: ${error}`);
            return false;
        }
    },

    on: (event, listener) => {
        eventEmitter.on(event, listener);
    }
}

export default cache;