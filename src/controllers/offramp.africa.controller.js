import db from "../models/index.js";

import {
  responseMapping,
  responseMappingError,
  responseMappingWithData,
} from "../utils/responseMapper.js";
import { getChannelsAfrica } from "../gateways/yellowCard.js";
const {
  User,
  Coin,
  OnRampTransaction,
  OffRampTransaction,
  FiatAccount,
  Payout,
  Usdt,
} = db;

export async function getChannels(request,reply) {
  try {
    const channels = await getChannelsAfrica();
    if (channels) {
      return reply
        .status(200)
        .send(responseMappingWithData(200, "Success", channels));
    }
  } catch (error) {
    return reply
      .status(500)
      .send(responseMapping(500, `Internal server error`));
  }
}
