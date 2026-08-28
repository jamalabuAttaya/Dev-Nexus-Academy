import fs from "node:fs";
import path from "node:path";

const requiredFiles = [
  ".env.example",
  ".env.production.example",
  ".github/workflows/ci.yml",
  "DEPLOYMENT.md",
  "public/favicon.svg",
  "public/icon-192.png",
  "public/icon-512.png",
  "public/apple-touch-icon.png",
  "public/logo.svg",
  "public/og-card.svg",
  "public/og.png",
  "vercel.json",
  "laravel-api/.env.example",
  "laravel-api/.env.production.example",
  "laravel-api/Dockerfile",
  "laravel-api/database/seeders/DatabaseSeeder.php",
  "laravel-api/phpunit.xml",
];

const missing = requiredFiles.filter(
  (file) => !fs.existsSync(path.resolve(process.cwd(), file)),
);

if (missing.length) {
  console.error(
    JSON.stringify({ ok: false, missingDeploymentFiles: missing }, null, 2),
  );
  process.exit(1);
}

const forbiddenPaths = ["worker", "hosting-output", "dist/worker"];
const presentForbidden = forbiddenPaths.filter((file) =>
  fs.existsSync(path.resolve(process.cwd(), file)),
);

if (presentForbidden.length) {
  console.error(
    JSON.stringify({ ok: false, forbiddenPaths: presentForbidden }, null, 2),
  );
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      ok: true,
      requiredDeploymentFiles: requiredFiles.length,
      forbiddenPaths: 0,
    },
    null,
    2,
  ),
);
