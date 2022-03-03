const { renderToString } = require("@vue/server-renderer");
const { createSSRApp } = require("vue");
async function routes(fastify, options) {
  fastify.get("/", async (request, reply) => {
    const app = createSSRApp({
      data() {
        return {
          user: "HalfWeb",
        };
      },
      template: `<div>Current user is: {{user}}</div>`,
    });
    const appContent = await renderToString(app);
    const html = `
    <html>
      <body>
        <h1>My First Heading</h1>
        <div id="app">${appContent}</div>
      </body>
    </html>
    `;
    reply.header('Content-Type', 'text/html; charset=utf-8');
    reply.send(html);
    // reply.send({hello: 'world'});
  });
}

module.exports = routes;
