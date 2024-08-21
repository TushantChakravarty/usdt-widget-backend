import db from "../models/index.js";
import { compare, encrypt } from "../utils/password.util.js"

const { User } = db
/**
 * Registers a new user.
 * @controller user
 * @route POST /api/v1/user/signup
 * @param {Object} request - The request object.
 * @param {Object} reply - The reply object.
 * @throws {Error} If an error occurs while signing up.
 */
export async function signup(request, reply) {
    try {
        const { emailId, password } = request.body;
        // check if emailId exists. although we have checked above that no users exist, still this check is good for future additions to this route
        const userExists = await User.findOne({ where: { emailId } });
        if (userExists) return reply.status(409).send({ error: "Username already taken" });
        // encrypt password
        const encryptedPassword = await encrypt(password);
        // create user
        const admin = await User.create({
            emailId,
            password: encryptedPassword,
        });
        return reply.status(200).send({ message: "Signup Successful" });
    } catch (error) {
        reply.status(500).send({ error: error.message });
    }
}

/**
 * Authenticates an admin user and generates a login token.
 * @controller admin
 * @route POST /api/v1/user/login
 * @param {Object} request - The request object.
 * @param {Object} reply - The reply object.
 * @throws {Error} If an error occurs while logging in.
 */
export async function login(request, reply) { // login for admin team members
    try {
        const { emailId, password } = request.body;
        // find user by username where role is not empty, and compare password
        const user = await User.scope("private").findOne({
            where: {
                emailId,
            }
        });
        if (!user) return reply.status(404).send({ error: "Invalid email or password" }); // generic error to prevent bruteforce
        // compare password
        const match = await compare(password, user.password);
        if (!match) return reply.status(401).send({ error: "Invalid username or password" }); // generic error to prevent bruteforce
        // generate token
        const token = await reply.jwtSign({
            id: user.id,
            role: user.role,
            emailId: user.emailId
        });
        // set token in cookie
        reply.setCookie("token", token, {
            httpOnly: true,
            secure: is_prod,
            sameSite: "strict",
            // signed: true, // dont use signed cookies with JWT
            expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 days
            path: "/",
        });
        return reply.status(200).send({ message: "Logged in", token });
    } catch (error) {
        reply.status(500).send({ error: error.message });
    }
}