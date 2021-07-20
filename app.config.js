export default () => {
  return {
    expo: {
      name: "Frux",
      primaryColor: "#18aa5e",
      slug: "frux-mobile",
      version: "1.0.0",
      orientation: "portrait",
      icon: "./assets/images/favicon.png",
      scheme: "frux",
      userInterfaceStyle: "automatic",
      splash: {
        image: "./assets/images/splash.png",
        resizeMode: "contain",
        backgroundColor: "#ffffff",
      },
      updates: {
        fallbackToCacheTimeout: 0,
      },
      assetBundlePatterns: ["**/*"],
      android: {
        adaptiveIcon: {
          foregroundImage: "./assets/images/favicon.png",
          backgroundColor: "#ffffff",
        },
        package: "com.fdelmazo.fruxmobile",
        googleServicesFile: "./google-services.json",
        config: {
          googleMaps: {
            apiKey: process.env.GOOGLE_APIKEY,
          },
        },
      },
      web: {
        favicon: "./assets/images/favicon.png",
      },
      plugins: [
        [
          "expo-notifications",
          {
            icon: "./assets/images/favicon.png",
          },
        ],
      ],
    },
  };
};
