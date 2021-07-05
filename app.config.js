export default () => {
  return {
    expo: {
      name: "Frux",
      slug: "frux-mobile",
      version: "1.0.0",
      orientation: "portrait",
      icon: "./assets/images/favicon.png",
      scheme: "frux",
      userInterfaceStyle: "light",
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
        userInterfaceStyle: "light",
        adaptiveIcon: {
          foregroundImage: "./assets/images/favicon.png",
          backgroundColor: "#ffffff",
        },
        package: "com.fdelmazo.fruxmobile",
        config: {
          googleMaps: {
            apiKey: process.env.GOOGLE_APIKEY,
          },
        },
      },
      web: {
        favicon: "./assets/images/favicon.png",
      },
    },
  };
};
