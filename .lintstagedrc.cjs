/**
 * lint-staged Configuration
 *
 * Runs linters and formatters on staged files only (fast pre-commit checks).
 * Files are automatically fixed when possible.
 *
 * This ensures:
 * - Code is formatted before commit
 * - Linting errors are caught early
 * - Only staged files are checked (fast)
 */

module.exports = {
  // TypeScript and TypeScript React files
  '*.{ts,tsx}': (filenames) => {
    const files = filenames
      .filter((f) => !f.includes('node_modules'))
      .filter((f) => !f.includes('.next'))
      .filter((f) => !f.includes('dist'))
      .filter((f) => !f.includes('build'))

    if (files.length === 0) return []

    return [
      `eslint --fix ${files.join(' ')}`,
      `prettier --write ${files.join(' ')}`,
    ]
  },

  // Markdown, JSON, YAML files
  '*.{md,json,yml,yaml}': (filenames) => {
    const files = filenames
      .filter((f) => !f.includes('node_modules'))
      .filter((f) => !f.includes('.next'))

    if (files.length === 0) return []

    return [`prettier --write ${files.join(' ')}`]
  },
}
