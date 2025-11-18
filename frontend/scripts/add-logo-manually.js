/**
 * Script to manually add logo to localStorage
 * Run this in browser console or as a Node script
 */

const logoUrl = "http://localhost:5000/uploads/file-1763498172551-371424871.png";

if (typeof window !== "undefined") {
  // Browser environment
  localStorage.setItem("emeraldrx_sidebar_logo", logoUrl);
  console.log("✅ Logo added to localStorage:", logoUrl);
  window.dispatchEvent(new Event("logoUpdated"));
  console.log("✅ Logo update event dispatched");
} else {
  // Node environment (for testing)
  console.log("Logo URL to add:", logoUrl);
  console.log("Run this in browser console:");
  console.log(`localStorage.setItem("emeraldrx_sidebar_logo", "${logoUrl}");`);
  console.log(`window.dispatchEvent(new Event("logoUpdated"));`);
}

