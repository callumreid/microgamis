import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.microgamis.app",
  appName: "microgamis",
  webDir: "out",
  server: {
    androidScheme: "http",
    cleartext: true,
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: false,
    },
  },
};

export default config;
