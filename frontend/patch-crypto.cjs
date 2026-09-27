const crypto = require('crypto');

// Node 16.13.2 has webcrypto hidden under the crypto module
if (!globalThis.crypto) {
  globalThis.crypto = crypto.webcrypto;
}

// Manually define getRandomValues if it's missing from the object
if (globalThis.crypto && !globalThis.crypto.getRandomValues) {
  globalThis.crypto.getRandomValues = (buffer) => {
    return crypto.randomFillSync(buffer);
  };
}

// Critical: Some versions of Vite look at the 'crypto' module specifically
if (!crypto.getRandomValues) {
  crypto.getRandomValues = (buffer) => {
    return crypto.randomFillSync(buffer);
  };
}