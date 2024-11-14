import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.celsius.app',
  appName: 'Celsius',
  webDir: 'out',
  bundledWebRuntime: false,
  server: {
    androidScheme: 'https',
    iosScheme: 'https',
    url: 'https://your-api-domain.com',
    cleartext: true
  },
  android: {
    backgroundColor: '#000000',
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: true
  },
  plugins: {
    StatusBar: {
      style: 'dark',
      backgroundColor: '#000000'
    },
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#000000",
      showSpinner: false,
      androidSpinnerStyle: "large",
      spinnerColor: "#ffffff",
      splashFullScreen: true,
      splashImmersive: true
    },
    Geolocation: {
      permissions: {
        android: {
          location: ["coarse", "fine"]
        }
      }
    }
  }
};

export default config;
