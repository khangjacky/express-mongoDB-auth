import app from './app';
import config from './config/config';
import logger from './helpers/logger';

// start server, listen port
app.listen(config.port, () =>
  logger.info(`Server started on port ${config.port} - ${config.env} mode`)
);

export default app;
