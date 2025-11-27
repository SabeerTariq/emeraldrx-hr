import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EmeraldRx HR Management System",
  description: "Comprehensive HR Management System for EmeraldRx Pharmacy",
};

/**
 * Root layout - wraps entire application
 * Sidebar is handled by (main) route group layout
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // Blocking script to load theme and logo before React hydrates
                // This prevents flash of default values on page refresh
                try {
                  var themeLoaded = false;
                  var logoLoaded = false;
                  
                  // Determine API URL
                  var apiUrl = 'http://localhost:5000';
                  
                  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                    apiUrl = 'http://localhost:5000';
                  } else {
                    // In production, use same origin (API should be proxied via Next.js rewrites)
                    // The rewrites in next.config.js will proxy /api/* to the backend
                    apiUrl = window.location.origin;
                  }
                  
                  // Fetch theme synchronously
                  var themeXhr = new XMLHttpRequest();
                  themeXhr.open('GET', apiUrl + '/api/settings/sidebar_theme', false);
                  themeXhr.send();
                  
                  if (themeXhr.status === 200) {
                    var themeData = JSON.parse(themeXhr.responseText);
                    if (themeData.success && themeData.data) {
                      window.__SIDEBAR_THEME__ = themeData.data;
                      themeLoaded = true;
                      
                      // Apply theme immediately to prevent flash
                      var nav = document.querySelector('nav[data-sidebar]');
                      if (nav) {
                        nav.style.backgroundColor = themeData.data.backgroundColor || '#ffffff';
                      }
                    }
                  }
                  
                  // Fetch logo synchronously
                  var logoXhr = new XMLHttpRequest();
                  logoXhr.open('GET', apiUrl + '/api/settings/sidebar_logo', false);
                  logoXhr.send();
                  
                  if (logoXhr.status === 200) {
                    var logoData = JSON.parse(logoXhr.responseText);
                    if (logoData.success) {
                      window.__SIDEBAR_LOGO__ = logoData.data;
                      logoLoaded = true;
                    }
                  }
                  
                  // Set flags
                  window.__SIDEBAR_THEME_LOADED__ = themeLoaded;
                  window.__SIDEBAR_LOGO_LOADED__ = logoLoaded;
                } catch (e) {
                  // If API fails, don't set hardcoded values
                  // Let React component fetch from database instead
                  window.__SIDEBAR_THEME__ = null;
                  window.__SIDEBAR_LOGO__ = null;
                  window.__SIDEBAR_THEME_LOADED__ = false;
                  window.__SIDEBAR_LOGO_LOADED__ = false;
                }
              })();
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}

