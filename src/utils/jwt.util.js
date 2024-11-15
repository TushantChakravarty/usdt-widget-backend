import db from "../models/index.js";
import { responseMappingError } from "./responseMapper.js";

const { User, Admin } = db;

export async function generateUserToken(details, fastify) {
    const { emailId } = details;
    const token = fastify.jwt.sign({ email:emailId }, { expiresIn: '1h' });
    return token;
  }

  export const validateToken = async (request, reply) => {
    try {
      const decodedToken = await request.jwtVerify();
  
      const user = await User.scope("private").findOne({
        where: { id: decodedToken.id },
      });
  
      if (!user) {
        return reply.status(401).send(responseMappingError(401,'unAuthorized'));
      }
  
      // Instead of decorating the request, just assign the user object directly
      request.user = user;
  
    } catch (err) {
      console.log(err);
      return reply.status(401).send(responseMappingError(401,'Your session expired'));
    }
  };

  export const validateAdminToken = async (request, reply) => {
    try {
      const decodedToken = await request.jwtVerify();
  
      const user = await Admin.scope("private").findOne({
        where: { id: decodedToken.id },
      });
  
      if (!user) {
        return reply.status(401).send(responseMappingError(401,'unAuthorized'));
      }
  
      // Instead of decorating the request, just assign the user object directly
      request.user = user;
  
    } catch (err) {
      console.log(err);
      return reply.status(401).send(responseMappingError(401,'Your session expired'));
    }
  };
  
  