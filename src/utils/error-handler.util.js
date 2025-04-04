/**
 * Custom error handler for Fastify
 * @param {*} fastify
 */
export default function handleErrors(fastify) {
    fastify.setErrorHandler((error, request, reply) => {
        if (error.validation) {
            const details = error.validation.map(e => ({
                message: e.message,
                param: e.schemaPath,
                e
            }));
            reply.status(400).send({
                code: 400,
                error: 'Bad Request',
                message: 'Validation failed',
                details: details
            });
        } else {
            reply.send(error);
        }
    });
}
