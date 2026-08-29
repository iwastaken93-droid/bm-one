import fs from "fs";
import path from "path";

const distDir = path.resolve(process.cwd(), "dist");
const publicDir = path.resolve(process.cwd(), "public");

if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });

// Copy all static public assets (including exact JS/CSS bundles and logos)
if (fs.existsSync(publicDir)) {
  fs.cpSync(publicDir, distDir, { recursive: true });
}

// Copy the authentic root index.html
fs.copyFileSync(
  path.resolve(process.cwd(), "index.html"),
  path.join(distDir, "index.html")
);

console.log("dist/ successfully prepared with 100% authentic dumped frontend!");
