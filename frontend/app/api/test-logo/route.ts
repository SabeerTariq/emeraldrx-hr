import { NextResponse } from "next/server";

/**
 * Test endpoint to manually set logo
 * GET /api/test-logo?filename=file-1763498172551-371424871.png
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get("filename") || "file-1763498172551-371424871.png";
  
  const logoUrl = `http://localhost:5000/uploads/${filename}`;
  
  return NextResponse.json({
    success: true,
    logoUrl,
    instructions: [
      "Open browser console (F12)",
      `Run: localStorage.setItem("emeraldrx_sidebar_logo", "${logoUrl}");`,
      `Run: window.dispatchEvent(new Event("logoUpdated"));`,
      "Logo should appear in sidebar immediately"
    ]
  });
}

