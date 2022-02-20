// CommonJs
const fastify = require('fastify')({
  logger: true
})
const router = require('./router');
fastify.register(router);

fastify.listen(3000, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  // 服务器监听地址：${address}
})