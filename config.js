module.exports = {
  development: {
    appContext: '',
    host: process.env.HOSTNAME || 'localhost',
    isProduction: false,
    port: 3000,
    app: {
      name: 'Instant Win App'
    }
  },
  production: {
    appContext: '',
    host: process.env.HOSTNAME || 'localhost',
    isProduction: true,
    port: 3000,
    app: {
      name: 'Instant Win App'
    }
  }
}[process.env.NODE_ENV || 'development'];
