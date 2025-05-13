export const environment = {
  production: true,
  firebase: {
    apiKey: "AIzaSyAIYZMdZm9XNVSmHqkZ60Nmv6BJSWPOwI0",
    authDomain: "quotablee.firebaseapp.com",
    projectId: "quotablee",
    storageBucket: "quotablee.firebasestorage.app",
    messagingSenderId: "175780719710",
    appId: "1:175780719710:web:a9df87f96ec54bbcfd98cf"
  },
  cloudinary: {
    uploadUrl: 'https://api.cloudinary.com/v1_1/detfb6fxd/image/upload', // https://api.cloudinary.com/v1_1/{CloudName}/image/upload
    uploadPreset: 'images' // Unisigned upload preset created on cloudinary
  }
};
