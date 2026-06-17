const logger = require('../utils/logger');
const config = require('../config');

function authMiddleware(req, res, next) {
  const apiKey = req.headers['x-api-key'] || req.headers['authorization']?.replace('Bearer ', '');

  if (!apiKey) {
    logger.warn('Request received without API key', { ip: req.ip, path: req.path });
    return res.status(401).json({
      success: false,
      message: 'Missing API key. Provide via X-API-Key header or Authorization bearer token.',
    });
  }

  if (apiKey !== config.server.apiKey) {
    logger.warn('Request received with invalid API key', { ip: req.ip, path: req.path });
    return res.status(403).json({
      success: false,
      message: 'Invalid API key.',
    });
  }

  next();
}

module.exports = authMiddleware;
