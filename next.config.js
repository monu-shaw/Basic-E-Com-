/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env:{
    MONGO_URI: "mongodb+srv://monu:pDngdb8RlgQZBbpw@cluster0.6mrqlco.mongodb.net/montatc?retryWrites=true&w=majority"
  }
}

module.exports = nextConfig
