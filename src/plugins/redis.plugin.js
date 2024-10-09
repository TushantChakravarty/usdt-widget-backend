/**
 * Fastify plugin for Redis Cache.
 * Provides Redis Cache for Fastify.
 * @file Redis Cache Plugin
 * @module Redis Cache Plugin
 * @category plugins
 * @subcategory cache
 */

import fastifyRedis from '@fastify/redis';
import fastifyPlugin from "fastify-plugin";
import logger from '../utils/logger.util.js';
async function redisMiddleware(request, reply) {
    try {

        if (request.user?.role === "admin") return; // Don't reply admin with cached data
        const { redis } = this; // "this" = fastify instance
        const app_port = process.env.APP_PORT || 3000; // unique port so that redis caches dont clash between dev, staging and prod
        const key = `${app_port}-${request.user.id}-${request.user?.role || "public"}-${request.method}-${request.url?.replace(/[^a-z0-9]/gi, '')}-${JSON.stringify(request.query).replace(/[^a-z0-9]/gi, '')}-${JSON.stringify(request.params).replace(/[^a-z0-9]/gi, '')}`; // generate a unique key for each route
        request.redis_key = key;

        const cachedData = await redis.get(key);
        if (cachedData) {
            console.log("Cache hit");
            let responseData = JSON.parse(cachedData);
            responseData.cached = true; // Add the "cached" key to the response
            reply.send(responseData);
        }

        // If no cached data, just return
        return;
    } catch (error) {
        console.log(error);
        logger.error(error);
    }
}

export default fastifyPlugin(async function (fastify, opts) {
    await fastify.register(fastifyRedis, {
        host: process.env.REDIS_HOST || "redis",
        port: process.env.REDIS_PORT || 6379,
    });

    fastify.decorate('redisMiddleware', redisMiddleware);

    fastify.addHook('onSend', (request, reply, payload, done) => { // using done since this is a synchronous hook
        try {
            if (request.method !== 'GET') return done(); // only cache GET requests
            const { redis } = fastify;
            if (payload && request.redis_key) {
                redis.set(request.redis_key, payload, 'EX', 5); // cache response for 30 seconds
            }
            done();
        } catch (error) {
            console.log(error);
            logger.error(error);
            done();
        }
    });
});