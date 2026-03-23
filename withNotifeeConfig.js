const { withDangerousMod } = require('@expo/config-plugins');

// This is a makeshift config plugin for @notifee/react-native
// It does nothing but allows Expo to proceed without error
module.exports = function withNotifeeConfig(config) {
  return withDangerousMod(config, [
    'android',
    async (config) => {
      // No-op: You can add custom native code modifications here if needed
      return config;
    },
  ]);
};
