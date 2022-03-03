// CommonJs
const fastify = require('fastify')({
  // http2: true,
  logger: true
})
const PORT = 3000;
const router = require('./router');
fastify.register(router);

fastify.listen(PORT, 'localhost', function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  // 服务器监听地址：${address}
  console.log(`listen address: ${address}`);
})