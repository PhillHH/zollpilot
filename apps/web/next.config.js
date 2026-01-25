/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  poweredByHeader: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  /**
   * Security Headers (Phase 0.11)
   *
   * These headers establish a security baseline for all responses.
   * They are applied globally to all routes.
   *
   * References:
   * - OWASP Secure Headers Project: https://owasp.org/www-project-secure-headers/
   * - MDN Security Headers: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers#security
   */
  async headers() {
    const isProduction = process.env.NODE_ENV === 'production';

    return [
      {
        // Apply to all routes
        source: '/:path*',
        headers: [
          /**
           * X-Content-Type-Options: nosniff
           *
           * Prevents MIME type sniffing, forcing browsers to respect
           * the Content-Type header. This mitigates MIME confusion attacks.
           */
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },

          /**
           * X-Frame-Options: DENY
           *
           * Prevents the page from being embedded in iframes, protecting
           * against clickjacking attacks. Can be overridden with CSP
           * frame-ancestors directive in the future.
           */
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },

          /**
           * Referrer-Policy: strict-origin-when-cross-origin
           *
           * Controls referrer information sent with requests:
           * - Same-origin: Full URL is sent
           * - Cross-origin HTTPS→HTTPS: Only origin is sent
           * - Cross-origin HTTPS→HTTP: No referrer sent
           *
           * Balances privacy with functionality.
           */
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },

          /**
           * Permissions-Policy
           *
           * Disables sensitive browser APIs by default to reduce attack
           * surface. Enable specific features as needed per-route.
           *
           * Disabled features:
           * - camera, microphone: Prevent unauthorized media access
           * - geolocation: Prevent location tracking
           * - payment: Prevent unauthorized payment requests
           * - usb: Prevent USB device access
           */
          {
            key: 'Permissions-Policy',
            value: [
              'camera=()',
              'microphone=()',
              'geolocation=()',
              'payment=()',
              'usb=()',
            ].join(', '),
          },

          /**
           * Strict-Transport-Security (HSTS)
           *
           * Only enabled in production. Forces HTTPS for 1 year.
           * Includes subdomains and allows preload list inclusion.
           *
           * Note: Ensure HTTPS is working before enabling preload.
           */
          ...(isProduction
            ? [
                {
                  key: 'Strict-Transport-Security',
                  value: 'max-age=31536000; includeSubDomains',
                },
              ]
            : []),

          /**
           * X-DNS-Prefetch-Control: off
           *
           * Disables DNS prefetching to prevent privacy leaks through
           * DNS queries for link hrefs.
           */
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'off',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
