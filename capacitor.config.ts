import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.jarvisstrong.app',
  appName: 'Jarvis Strong',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    url: 'https://jarvis-strong-app.vercel.app',
    cleartext: false,
  },
  android: {
    backgroundColor: '#0A0A14',
  },
};

export default config;
