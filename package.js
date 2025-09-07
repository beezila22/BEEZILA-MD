{
  "name": "silatrix-md",
  "version": "1.0.0",
  "description": "SILATRIX MD WhatsApp Bot na Vipengele Vingi",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "test": "echo \"Error: no test specified\" && exit 1",
    "fix-deps": "npm install --no-audit --no-fund --legacy-peer-deps"
  },
  "keywords": ["whatsapp", "bot", "baileys", "silatrix"],
  "author": "SILA TECH",
  "license": "MIT",
  "dependencies": {
    "@hapi/boom": "^10.0.0",
    "@whiskeysockets/baileys": "^6.4.0",
    "axios": "^1.4.0",
    "chalk": "^4.1.2",
    "file-type": "^18.0.0",
    "node-cache": "^5.1.2",
    "pino": "^8.14.1",
    "awesome-phonenumber": "^3.6.0",
    "libphonenumber-js": "^1.10.34",
    "openai": "^4.0.0"
  },
  "engines": {
    "node": ">=16.0.0"
  }
}