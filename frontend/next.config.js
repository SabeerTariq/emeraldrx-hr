/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Ensure proper static file serving
  trailingSlash: false,
  
  // Generate source maps for better debugging (disable in production if needed)
  productionBrowserSourceMaps: false,
  
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: '**',
        pathname: '/uploads/**',
      },
    ],
  },
  
  // Rewrites for API proxying
  async rewrites() {
    // Get API URL from environment
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    
    // If no API URL is set, don't use rewrites (client will call API directly)
    // This is useful when backend is on completely different server
    if (!apiUrl) {
      console.warn('⚠️  NEXT_PUBLIC_API_URL not set - API calls will be made directly by client');
      return [];
    }
    
    // Extract base URL (remove /api suffix if present)
    const baseUrl = apiUrl.replace(/\/api\/?$/, '');
    
    console.log(`✅ API rewrites enabled: /api/* -> ${baseUrl}/api/*`);
    
    // Enable rewrites to proxy /api/* and /uploads/* to backend
    return [
      {
        source: '/api/:path*',
        destination: `${baseUrl}/api/:path*`,
      },
      {
        source: '/uploads/:path*',
        destination: `${baseUrl}/uploads/:path*`,
      },
    ];
  },
  
  // Inject environment variables into the client
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  
  // Webpack configuration to handle chunk loading
  webpack: (config, { isServer }) => {
    // Ensure chunks are properly generated
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            // Vendor chunk
            vendor: {
              name: 'vendor',
              chunks: 'all',
              test: /node_modules/,
              priority: 20,
            },
            // Common chunk
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              priority: 10,
              reuseExistingChunk: true,
              enforce: true,
            },
          },
        },
      };
    }
    return config;
  },
};

module.exports = nextConfig;

