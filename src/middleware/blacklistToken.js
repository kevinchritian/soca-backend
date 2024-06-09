const blacklistedTokens = new Set();

function isTokenBlacklisted(token) {
  return blacklistedTokens.has(token);
}

function addTokenToBlacklist(token) {
  blacklistedTokens.add(token);
}

module.exports = { isTokenBlacklisted, addTokenToBlacklist };