# Contributing

Thank you for improving Dev Nexus Academy. Keep changes focused, source educational material clearly, and preserve Arabic/English and RTL/LTR support.

## Workflow

1. Create a branch from `main`.
2. Install frontend dependencies with `npm ci`.
3. Install API dependencies with `composer install` inside `laravel-api`.
4. Make one focused change with tests where relevant.
5. Run `npm run check` and `php artisan test`.
6. Open a pull request using the repository template.

## Content standards

- Link to the original publisher or author.
- Prefer free or public-access material.
- Do not upload or mirror protected books, videos, or articles.
- Include discipline, level, language, and source.
- Verify that embedded playback or reading is allowed by the provider.

Never commit `.env` files, keys, tokens, local databases, `node_modules`, or `vendor`.
