import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.coursify',
  appName: 'coursify',
  webDir: 'out',
  server: {
    androidScheme: 'https'
  }
};

export default config;
