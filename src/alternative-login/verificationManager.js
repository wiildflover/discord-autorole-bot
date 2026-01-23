/**
 * File: verificationManager.js
 * Author: Wildflover
 * Description: Manages OAuth state generation, validation, and user verification
 *              Handles secure state tokens and expiration
 * Language: JavaScript (Node.js)
 */

const crypto = require('crypto');
const logger = require('../utils/logger');

/**
 * In-memory state storage (use Redis in production)
 * Structure: { state: { userId, timestamp, used } }
 */
const stateStorage = new Map();

/**
 * State expiration time (10 minutes)
 */
const STATE_EXPIRY_MS = 10 * 60 * 1000;

/**
 * Cleanup interval (5 minutes)
 */
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;

/**
 * Start automatic cleanup of expired states
 */
function startCleanupTask() {
  setInterval(() => {
    const now = Date.now();
    let cleanedCount = 0;
    
    for (const [state, data] of stateStorage.entries()) {
      if (now - data.timestamp > STATE_EXPIRY_MS) {
        stateStorage.delete(state);
        cleanedCount++;
      }
    }
    
    if (cleanedCount > 0) {
      logger.info('VERIFICATION-CLEANUP', `Removed ${cleanedCount} expired states`);
    }
  }, CLEANUP_INTERVAL_MS);
  
  logger.info('VERIFICATION-INIT', 'Cleanup task started');
}

/**
 * Generate secure state token for OAuth flow
 * @param {string} userId - Discord user ID
 * @returns {string} Base64 encoded state token
 */
function generateState(userId) {
  const random = crypto.randomBytes(32).toString('hex');
  const timestamp = Date.now();
  
  const stateData = {
    userId,
    random,
    timestamp
  };
  
  const state = Buffer.from(JSON.stringify(stateData)).toString('base64url');
  
  stateStorage.set(state, {
    userId,
    timestamp,
    used: false
  });
  
  logger.info('VERIFICATION-STATE', `Generated state for user ${userId}`);
  
  return state;
}

/**
 * Validate state token and return user ID
 * @param {string} state - State token to validate
 * @returns {Object|null} { userId, valid } or null if invalid
 */
function validateState(state) {
  const stateData = stateStorage.get(state);
  
  if (!stateData) {
    logger.warn('VERIFICATION-VALIDATE', 'State not found or expired');
    return { valid: false, error: 'Invalid or expired state' };
  }
  
  if (stateData.used) {
    logger.warn('VERIFICATION-VALIDATE', 'State already used');
    return { valid: false, error: 'State already used' };
  }
  
  const now = Date.now();
  if (now - stateData.timestamp > STATE_EXPIRY_MS) {
    stateStorage.delete(state);
    logger.warn('VERIFICATION-VALIDATE', 'State expired');
    return { valid: false, error: 'State expired' };
  }
  
  logger.info('VERIFICATION-VALIDATE', `State valid for user ${stateData.userId}`);
  
  return {
    valid: true,
    userId: stateData.userId
  };
}

/**
 * Mark state as used to prevent replay attacks
 * @param {string} state - State token to mark as used
 */
function markStateAsUsed(state) {
  const stateData = stateStorage.get(state);
  
  if (stateData) {
    stateData.used = true;
    stateStorage.set(state, stateData);
    logger.info('VERIFICATION-MARK', `State marked as used`);
  }
}

/**
 * Get statistics about state storage
 * @returns {Object} Statistics object
 */
function getStats() {
  const now = Date.now();
  let activeStates = 0;
  let expiredStates = 0;
  let usedStates = 0;
  
  for (const [, data] of stateStorage.entries()) {
    if (data.used) {
      usedStates++;
    } else if (now - data.timestamp > STATE_EXPIRY_MS) {
      expiredStates++;
    } else {
      activeStates++;
    }
  }
  
  return {
    total: stateStorage.size,
    active: activeStates,
    expired: expiredStates,
    used: usedStates
  };
}

/**
 * Clear all states (for testing/maintenance)
 */
function clearAllStates() {
  const count = stateStorage.size;
  stateStorage.clear();
  logger.warn('VERIFICATION-CLEAR', `Cleared ${count} states`);
}

module.exports = {
  startCleanupTask,
  generateState,
  validateState,
  markStateAsUsed,
  getStats,
  clearAllStates
};
