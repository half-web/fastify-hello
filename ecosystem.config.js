module.exports = {
    apps: [
        {
            name: 'fastify-hello',
            script: './server.js',
            // exec_mode: 'fork',
            instances: 1,
            cwd: './',
            max_memory_restart: '512M',
            autorestart: true,
            merge_logs: true,
            env: {
                NODE_ENV: 'production',
            },
        },
    ],
};
