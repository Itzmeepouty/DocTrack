const blacklist = new Set();

function addToBlacklist(jti, exp) {
  blacklist.add(jti);

  setTimeout(() => blacklist.delete(jti), (exp * 1000) - Date.now());
}

function isBlacklisted(jti) {
  return blacklist.has(jti);
}

module.exports = { addToBlacklist, isBlacklisted };
