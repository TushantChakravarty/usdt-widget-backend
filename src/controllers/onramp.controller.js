import cryptoJs from "crypto-js";
import db from "../models/index.js";
import { compare, encrypt } from "../utils/password.util.js";
import logger from "../utils/logger.util.js";
import { getAllCoinsData } from "../ApiCalls/usdtapicalls.js";
import {
    responseMapping,
    responseMappingWithData,
} from "../utils/responseMapper.js";
import { Currencies } from "../utils/currencies.js";
import { networks } from "../utils/networks.js";

const { User, Coin, OnRampTransaction } = db;

export async function getAllOnRampTransaction(request, reply) {
    try {
        const { limit = 100, skip = 0 } = request.query
        const all_on_ramp = await OnRampTransaction.findAll({
            where: {
                user_id: request.user.id
            },
            limit: limit,
            offset: skip,
            //  order: [["createdAt", "DESC"]],
        })

        return reply.status(200).send(responseMappingWithData(200, "Success", all_on_ramp))

    } catch (error) {
        logger.error("user.controller.getQuotes", error.message)
        console.log('user.controller.getQUotes', error.message)
        return reply.status(500).send(responseMapping(500, `Internal server error`))

    }
}