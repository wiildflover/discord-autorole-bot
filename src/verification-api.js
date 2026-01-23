/**
 * File: verification-api.js
 * Author: Wildflover
 * Description: Simple HTTP API to check user verification status
 * Language: JavaScript (Node.js)
 */

const http = require('http');
const url = require('url');
const logger = require('./utils/logger');
const { isUserVerified, getVerifiedUsers } = require('./alternative-login/verificationCommand');

// [CONFIG] Server configuration
const PORT = process.env.PORT || 3000;

/**
 * Initialize verification API server
 */
function initializeVerificationAPI() {
  const server = http.createServer(async (req, res) => {
    // [CORS] Enable CORS for Tauri app
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return;
    }
    
    const parsedUrl = url.parse(req.url, true);
    
    // [ROUTE] Check verification status
    if (parsedUrl.pathname === '/api/verify/check' && req.method === 'GET') {
      const userId = parsedUrl.query.userId;
      
      if (!userId) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Missing userId parameter' }));
        return;
      }
      
      const verification = isUserVerified(userId);
      
      if (verification) {
        logger.info('VERIFY-API', `Verification check for ${userId}: VERIFIED`);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          verified: true,
          user: {
            id: userId,
            username: verification.username,
            discriminator: verification.discriminator,
            avatar: verification.avatar,
            global_name: verification.globalName
          },
          timestamp: verification.timestamp
        }));
      } else {
        logger.info('VERIFY-API', `Verification check for ${userId}: NOT VERIFIED`);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ verified: false }));
      }
      return;
    }
    
    // [ROUTE] Health check
    if (parsedUrl.pathname === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok', timestamp: Date.now() }));
      return;
    }
    
    // [ROUTE] 404
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  });
  
  server.listen(PORT, () => {
    logger.success('VERIFY-API', `Verification API listening on port ${PORT}`);
  });
  
  return server;
}

module.exports = {
  initializeVerificationAPI
};
