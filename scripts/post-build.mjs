/**
 * Post-build script for Vercel deployment
 * Generates the missing index.html for SPA static serving
 * 
 * TanStack Start with Cloudflare generates SSR output (dist/server)
 * but Vercel needs a static index.html in dist/client
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, "..");

const clientDir = path.join(rootDir, "dist", "client");
const indexPath = path.join(clientDir, "index.html");

// Find the main JS bundle and CSS
const assetsDir = path.join(clientDir, "assets");
let mainBundle = "";
let mainCss = "";

if (fs.existsSync(assetsDir)) {
  const files = fs.readdirSync(assetsDir);
  
  // Find CSS file
  const cssFile = files.find((f) => f.startsWith("styles-") && f.endsWith(".css"));
  if (cssFile) mainCss = `/assets/${cssFile}`;

  // Find the main JS bundle
  // Look for the largest JS file that isn't known to be a chunk or route
  const jsFiles = files.filter(
    (f) => f.endsWith(".js") && !f.includes("worker-entry")
  );
  
  if (jsFiles.length > 0) {
    // Get file sizes and sort by size descending
    const filesWithSize = jsFiles.map((f) => {
      const filePath = path.join(assetsDir, f);
      const size = fs.statSync(filePath).size;
      return { name: f, size };
    });
    
    filesWithSize.sort((a, b) => b.size - a.size);
    
    // The largest JS file should be the main bundle
    // (typically the React app + TanStack Router bundle)
    if (filesWithSize[0]) {
      mainBundle = `/assets/${filesWithSize[0].name}`;
    }
  }
}

// Generate the HTML template with proper SPA structure
// This HTML will be served to all routes and TanStack Router handles client-side routing
const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Find, book, and consult vetted lawyers with end-to-end encryption." />
    <meta name="author" content="Avocat-Link" />
    
    <!-- OG Tags -->
    <meta property="og:title" content="Avocat-Link — Premium LegalTech" />
    <meta property="og:description" content="Find, book, and consult vetted lawyers with end-to-end encryption." />
    <meta property="og:type" content="website" />
    
    <!-- Twitter Tags -->
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:site" content="@Lovable" />
    
    <title>Avocat-Link — Premium LegalTech</title>
    ${mainCss ? `<link rel="stylesheet" href="${mainCss}" />` : ""}
  </head>
  <body>
    <!-- Mount point for React SPA -->
    <!-- TanStack Router will render the app here -->
    <div id="app"></div>
    
    <!-- Load the main React bundle -->
    <!-- This bundle includes TanStack Router and handles all client-side routing -->
    <script type="module" src="${mainBundle}"></script>
  </body>
</html>
`;

// Ensure directory exists
if (!fs.existsSync(clientDir)) {
  fs.mkdirSync(clientDir, { recursive: true });
}

// Write the index.html
fs.writeFileSync(indexPath, html, "utf-8");

console.log("✅ Post-build: Generated dist/client/index.html");
console.log(`   - Main bundle: ${mainBundle}`);
console.log(`   - Main CSS: ${mainCss}`);
console.log(`   - Mount point: <div id="app"></div>`);
console.log(`\n📋 SPA ready for Vercel deployment!`);
