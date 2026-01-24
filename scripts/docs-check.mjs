#!/usr/bin/env node

/**
 * Documentation Drift Checker
 *
 * Validates that documentation stays in sync with code:
 * - Internal markdown links point to existing files
 * - Documented routes/endpoints exist in Next.js app
 * - Anchors in links map to actual headings (best-effort)
 *
 * Usage: node scripts/docs-check.mjs
 * Config: scripts/docs-check.config.json
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '..');

// Load configuration
const configPath = path.join(__dirname, 'docs-check.config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

const DOCS_DIR = path.join(REPO_ROOT, 'docs');
const ROUTE_BASE_DIR = path.join(REPO_ROOT, config.routeBaseDir);

let errors = [];
let warnings = [];

/**
 * Recursively find all markdown files in a directory
 */
function findMarkdownFiles(dir) {
  const files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...findMarkdownFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      files.push(fullPath);
    }
  }

  return files;
}

/**
 * Extract markdown links from content
 * Matches: [text](./file.md), [text](../file.md#anchor), etc.
 */
function extractMarkdownLinks(content, filePath) {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const links = [];
  let match;

  while ((match = linkRegex.exec(content)) !== null) {
    const [fullMatch, text, url] = match;

    // Skip external links (http://, https://, mailto:, etc.)
    if (url.match(/^(https?:|mailto:|ftp:)/i)) {
      continue;
    }

    // Skip absolute paths (these are internal routes, handled separately)
    if (url.startsWith('/') && !url.startsWith('./') && !url.startsWith('../')) {
      continue;
    }

    // Only process relative links
    if (url.startsWith('./') || url.startsWith('../')) {
      const line = content.substring(0, match.index).split('\n').length;
      links.push({ text, url, line, filePath });
    }
  }

  return links;
}

/**
 * Extract documented routes/endpoints from content
 * Looks for patterns like /admin, /api/health, /verfahren/[slug]
 * Ignores code blocks
 */
function extractDocumentedRoutes(content, filePath) {
  // Remove code blocks to avoid false positives
  const withoutCodeBlocks = content.replace(/```[\s\S]*?```/g, '');

  // Match route patterns: /path, /path/subpath, /api/endpoint, /[param], /path/[slug]
  const routeRegex = /(?:^|[\s("`'])(\/[a-z0-9\-_/\[\]]+)(?:[\s)"`']|$)/gim;
  const routes = new Set();
  let match;

  while ((match = routeRegex.exec(withoutCodeBlocks)) !== null) {
    const route = match[1];

    // Filter out common false positives
    if (route.match(/\/(home|user|zollpilot)$/i)) {
      continue; // Likely file paths, not routes
    }

    // Only include routes that look like Next.js routes
    if (route.match(/^\/([a-z0-9\-_]+|api|admin|verfahren)/i)) {
      routes.add(route);
    }
  }

  return Array.from(routes).map(route => ({ route, filePath }));
}

/**
 * Extract headings from markdown for anchor validation
 */
function extractHeadings(content) {
  const headingRegex = /^#{1,6}\s+(.+)$/gm;
  const headings = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const heading = match[1].trim();
    // Convert heading to anchor format: lowercase, replace spaces with hyphens
    const anchor = heading
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
    headings.push(anchor);
  }

  return headings;
}

/**
 * Validate internal markdown links
 */
function validateMarkdownLinks(files) {
  console.log('📝 Validating internal markdown links...');

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8');
    const links = extractMarkdownLinks(content, file);

    for (const link of links) {
      const [urlPath, anchor] = link.url.split('#');
      const absolutePath = path.resolve(path.dirname(link.filePath), urlPath);

      // Check if target file exists
      if (!fs.existsSync(absolutePath)) {
        const relPath = path.relative(REPO_ROOT, link.filePath);
        errors.push(
          `${relPath}:${link.line} - Broken link: "${link.url}" (target not found: ${path.relative(REPO_ROOT, absolutePath)})`
        );
        continue;
      }

      // Validate anchor if present
      if (anchor) {
        const targetContent = fs.readFileSync(absolutePath, 'utf-8');
        const headings = extractHeadings(targetContent);

        if (!headings.includes(anchor)) {
          const relPath = path.relative(REPO_ROOT, link.filePath);
          warnings.push(
            `${relPath}:${link.line} - Anchor not found: "${anchor}" in ${path.relative(REPO_ROOT, absolutePath)}`
          );
        }
      }
    }
  }
}

/**
 * Map Next.js route to file path
 * Examples:
 *   /admin -> apps/web/src/app/admin/page.tsx
 *   /api/health -> apps/web/src/app/api/health/route.ts
 *   /verfahren/[slug] -> apps/web/src/app/verfahren/[slug]/page.tsx
 */
function routeToFilePath(route) {
  const routePart = route === '/' ? '' : route;

  // API routes end with route.ts
  if (route.startsWith('/api/')) {
    return path.join(ROUTE_BASE_DIR, `${routePart}/route.ts`);
  }

  // Page routes end with page.tsx
  return path.join(ROUTE_BASE_DIR, routePart === '' ? 'page.tsx' : `${routePart}/page.tsx`);
}

/**
 * Validate documented routes exist in Next.js app
 */
function validateDocumentedRoutes(files) {
  console.log('🛣️  Validating documented routes...');

  const allRoutes = [];

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8');
    const routes = extractDocumentedRoutes(content, file);
    allRoutes.push(...routes);
  }

  // Deduplicate routes
  const uniqueRoutes = [...new Map(allRoutes.map(r => [r.route, r])).values()];

  console.log(`   Found ${uniqueRoutes.length} documented routes`);

  for (const { route, filePath } of uniqueRoutes) {
    // Check if route is in ignore list
    if (config.ignoredRoutes.includes(route)) {
      console.log(`   ⚠️  Route ${route} is allowlisted (ignored)`);
      continue;
    }

    const expectedPath = routeToFilePath(route);

    if (!fs.existsSync(expectedPath)) {
      const relDocPath = path.relative(REPO_ROOT, filePath);
      const relExpectedPath = path.relative(REPO_ROOT, expectedPath);
      errors.push(
        `${relDocPath} - Documented route "${route}" not found in code (expected: ${relExpectedPath})`
      );
    }
  }
}

/**
 * Main execution
 */
function main() {
  console.log('🔍 Documentation Drift Check\n');
  console.log(`📂 Docs directory: ${path.relative(REPO_ROOT, DOCS_DIR)}`);
  console.log(`📂 Route base: ${path.relative(REPO_ROOT, ROUTE_BASE_DIR)}\n`);

  // Find all markdown files
  const markdownFiles = findMarkdownFiles(DOCS_DIR);
  console.log(`📄 Found ${markdownFiles.length} markdown files\n`);

  // Skip files in ignore list
  const filesToCheck = markdownFiles.filter(file => {
    const relPath = path.relative(DOCS_DIR, file);
    return !config.ignoredFiles.includes(relPath);
  });

  if (filesToCheck.length < markdownFiles.length) {
    console.log(`⚠️  Ignoring ${markdownFiles.length - filesToCheck.length} files from allowlist\n`);
  }

  // Run validations
  validateMarkdownLinks(filesToCheck);
  validateDocumentedRoutes(filesToCheck);

  // Report results
  console.log('\n📊 Results\n');

  if (warnings.length > 0) {
    console.log('⚠️  Warnings:');
    warnings.forEach(w => console.log(`   ${w}`));
    console.log();
  }

  if (errors.length > 0) {
    console.log('❌ Errors:');
    errors.forEach(e => console.log(`   ${e}`));
    console.log();
    console.log(`❌ Documentation drift detected: ${errors.length} error(s)\n`);
    console.log('💡 To fix:');
    console.log('   1. Update documentation to match code');
    console.log('   2. Add missing routes/pages to code');
    console.log('   3. Add to ignoredRoutes in scripts/docs-check.config.json (with justification)\n');
    process.exit(1);
  }

  console.log('✅ No documentation drift detected');
  console.log(`   ${filesToCheck.length} files checked`);
  console.log(`   ${warnings.length} warnings (non-blocking)`);
  console.log();
}

main();
