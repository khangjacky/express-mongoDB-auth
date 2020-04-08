const config = {
  env: process.env.NODE_ENV || 'development',
  mongoURI: process.env.MONGO_URI,
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET || '123456',
  jwtExpired: process.env.JWT_EXPIRED || '7d',
  winstonLevel: process.env.WINSTON_LEVEL || 'info',
  errorLog: process.env.ERROR_LOG || 'log/error.log',
  combinedLog: process.env.COMBINED_LOG || 'log/combined.log',
};

export default config;
