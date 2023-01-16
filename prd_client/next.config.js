/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  publicRuntimeConfig : {
    maxUploadImage : 5000000
  },
  env : {
    MONGO_URI : process.env.MONGO_URI,
    SECRET : process.env.SECRET,
    AUTHORIZATION_EXPIRATION : process.env.AUTHORIZATION_EXPIRATION,
    SENDGRID_KEY : process.env.SENDGRID_KEY,
    firebaseConfig_apiKey : process.env.firebaseConfig_apiKey,
    firebaseConfig_authDomain : process.env.firebaseConfig_authDomain,
    firebaseConfig_projectId : process.env.firebaseConfig_projectId,
    firebaseConfig_storageBucket : process.env.firebaseConfig_storageBucket,
    firebaseConfig_messagingSenderId : process.env.firebaseConfig_messagingSenderId,
    firebaseConfig_appId : process.env.firebaseConfig_appId,
    firebaseConfig_measurementId : process.env.firebaseConfig_measurementId,
    REGISTER_ADMIN_SECRET : process.env.REGISTER_ADMIN_SECRET
  }
}

module.exports = nextConfig
