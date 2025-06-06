// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyAIYZMdZm9XNVSmHqkZ60Nmv6BJSWPOwI0",
    authDomain: "quotablee.firebaseapp.com",
    projectId: "quotablee",
    storageBucket: "quotablee.firebasestorage.app",
    messagingSenderId: "175780719710",
    appId: "1:175780719710:web:a9df87f96ec54bbcfd98cf",
    measurementId: "G-71VZLQXG9C"
  },
  cloudinary: {
    uploadUrl: 'https://api.cloudinary.com/v1_1/detfb6fxd/image/upload', // https://api.cloudinary.com/v1_1/{CloudName}/image/upload
    uploadPreset: 'images', // Unisigned upload preset created on cloudinary
    apiKey: '569997469433219'
  },
  siteUrl: 'https://quotablee.web.app'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
