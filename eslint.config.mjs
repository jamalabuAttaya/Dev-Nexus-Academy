import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  {
    rules: {
      "@next/next/no-img-element": "off",
    },
  },

  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",

    "laravel-api/vendor/**",
    "laravel-api/node_modules/**",
    "laravel-api/storage/**",
    "laravel-api/bootstrap/cache/**",
    "laravel-api/public/build/**",
  ]),
]);

export default eslintConfig;
