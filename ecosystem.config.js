module.exports = {
  apps: [
    {
      name: 'github-project',
      script: './server.js',
      instance: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
};
