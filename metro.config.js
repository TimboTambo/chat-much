const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Drizzle migrations are .sql files imported from drizzle/migrations.js.
config.resolver.sourceExts.push('sql');

module.exports = config;
