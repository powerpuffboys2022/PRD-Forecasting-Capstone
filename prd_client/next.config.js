/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env : {
    MONGO_URI : process.env.MONGO_URI,
    SECRET : process.env.SECRET,
    AUTHORIZATION_EXPIRATION : process.env.AUTHORIZATION_EXPIRATION
  }
}

module.exports = nextConfig
