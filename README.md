# frux-mobile

Android Client for Frux.

<img src="docs/logo.png" alt="Logo" width="500px">

[![MIT License](https://img.shields.io/apm/l/atomic-design-ui.svg?)](https://github.com/tterb/atomic-design-ui/blob/master/LICENSEs)

## What is Frux?

Frux is the newest crowdfunding app in town.

This whole project is being documented in our own [**Notion** page](https://www.notion.so/fdelmazo/frux-efab2dee3dd74d52b2a57311a1891bd4) from where you'll get the latest news, updates, documentation, and everything in between.

If you are only interested in the source code, check out the different repos!

- [frux-app-server](https://github.com/camidvorkin/frux-app-server)
- [frux-web](https://github.com/JuampiRombola/frux-web)
- [frux-mobile](https://github.com/FdelMazo/frux-mobile)

Frux is currently being developed by

- [@fdelmazo](https://www.github.com/FdelMazo)
- [@camidvorkin](https://www.github.com/camidvorkin)
- [@JuampiRombola](https://www.github.com/JuampiRombola)
- [@JDSanto](https://www.github.com/JDSanto)

## Tech Stack

This mobile app is developed in [React Native](https://reactnative.dev/) with tremendous help from [Expo](https://expo.io/). The UI framework used is [Magnus](https://magnus-ui.com/), and is truly one of the best mobile UI frameworks out there.

## Try it out!

Go to your favourite Android device and download the [Expo Go](https://expo.io/client) app. After that you can either input the Expo link or scan the Expo QR to try out the latest build (thanks to some Github CI magic)

[`exp://exp.host/@fdelmazo/frux-mobile`](https://expo.io/@fdelmazo/frux-mobile)

![](docs/expo.png)

<!-- If you prefer to use the latest build in APK form, just go over to the [Github Actions tab](https://github.com/FdelMazo/frux-mobile/actions) of this repo and click on the latest workflow run. In there you'll see the different build steps of the app, and on the last line of the build command you'll find the link to download the latest APK. -->

Even though this app is only developed for Android devices, Expo makes it pretty easy to port it to iOS too. If you are feeling risky, feel free to try it out on an iOS device with the Expo Go client installed.

## Developing

For development you'll need to have the Expo CLI installed in your system. You can do so by running `npm install -g expo-cli`

After cloning this repository, install the dependencies with `npm install` and then you'll be free to start developing right away with `expo start`

For lots of users actions you'll need a properly set up environment with the Firebase credentials. Just ask one of the original developers for their own `.env` file and copy it into the root directory of the project. Make sure to never check that file into our vcs!
