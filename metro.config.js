const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// victory-native is SVG-based (legacy Victory port, see package.json) but its
// native-only peer setup doesn't resolve cleanly on web. It shares the same
// public API as the platform-agnostic `victory` package, so swap the import
// on web only and leave every component importing from 'victory-native'.
const originalResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'victory-native' && platform === 'web') {
    return context.resolveRequest(context, 'victory', platform);
  }
  if (originalResolveRequest) {
    return originalResolveRequest(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
