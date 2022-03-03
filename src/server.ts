import Fastify from 'fastify';
import fastifyNextjs from 'fastify-nextjs';
import config from './config';
const fastify = Fastify({ logger: true, pluginTimeout: 20000 });

console.log('process.env.NODE_ENV', process.env.NODE_ENV);
fastify
    .register(fastifyNextjs, {
        dev: process.env.NODE_ENV !== 'production',
        logLevel: 'debug',
        noServeAssets: false,
    })
    .after(() => {
        fastify.next('/home');
        fastify.next('/counter');
        fastify.next('/about');
        fastify.next('/post/**/*');
    });

fastify.get('/health', async () => {
    return { ok: true };
});

fastify.get('/', (_, reply) => {
    reply.redirect('/home');
});

fastify.listen(config.port, (address) => {
    fastify.log.info(`Server listening on ${address}`);
});
