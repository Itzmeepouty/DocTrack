const blacklist = new Set();

function addToBlacklist(jti, expSeconds) {
  if (!jti) return;
  blacklist.add(jti);

  const nowMS = Date.now();
  const expMS = (expSeconds || 0) * 1000;
  const ttl = expMS - nowMS;

  const delay = ttl > 0 ? ttl : 5000;

  setTimeout(() => {
    blacklist.delete(jti);
  }, delay);
}

function isBlacklisted(jti) {
  return blacklist.has(jti);
}

module.exports = { addToBlacklist, isBlacklisted };