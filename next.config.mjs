/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: [
    '192.168.0.103:3000', // LAN IP without http://
    'localhost:3000',      // localhost (optional, but safe)
  ],
}
export default nextConfig;
