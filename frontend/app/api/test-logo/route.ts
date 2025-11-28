import { NextResponse } from "next/server";

// Allowed origins for CORS
const allowedOrigins = [
  "https://emeraldsrxhr.sitestaginglink.com",
  "http://localhost:1206",
  "http://localhost:3000",
  "http://localhost:3001",
];

// Helper function to add CORS headers
function addCorsHeaders(response: NextResponse, origin: string | null) {
  if (origin && allowedOrigins.includes(origin)) {
    response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set("Access-Control-Allow-Credentials", "true");
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  }
  return response;
}

/**
 * Handle preflight OPTIONS requests
 */
export async function OPTIONS(request: Request) {
  const origin = request.headers.get("origin");
  const response = new NextResponse(null, { status: 204 });
  return addCorsHeaders(response, origin);
}

/**
 * Test endpoint to manually set logo
 * GET /api/test-logo?filename=file-1763498172551-371424871.png
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get("filename") || "file-1763498172551-371424871.png";
  
  const logoUrl = `http://localhost:5000/uploads/${filename}`;
  
  const response = NextResponse.json({
    success: true,
    logoUrl,
    instructions: [
      "Open browser console (F12)",
      `Run: localStorage.setItem("emeraldrx_sidebar_logo", "${logoUrl}");`,
      `Run: window.dispatchEvent(new Event("logoUpdated"));`,
      "Logo should appear in sidebar immediately"
    ]
  });
  
  // Add CORS headers for production
  const origin = request.headers.get("origin");
  return addCorsHeaders(response, origin);
}

