module.exports = {
  apps: [{
    name: 'national-filing-backend',
    script: 'server.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development',
      PORT: 3010
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3010,
      DB_HOST: 'srv407.hstgr.io',
      DB_USER: 'u802453729_infonationalf',
      DB_PASSWORD: '&QGS7N*t',
      DB_NAME: 'u802453729_BOI',
      DB_PORT: 3306,
      JWT_SECRET: 'your_jwt_secret_key_here_change_this',
      CORS_ORIGIN: '*'
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};