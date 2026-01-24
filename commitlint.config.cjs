/**
 * Commitlint Configuration
 *
 * Enforces conventional commit message format for better changelog generation
 * and semantic versioning support.
 *
 * Format: <type>(<scope>): <subject>
 * Example: feat(auth): add user login endpoint
 *
 * @see https://www.conventionalcommits.org/
 */

module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Allowed types
    'type-enum': [
      2,
      'always',
      [
        'feat', // New feature
        'fix', // Bug fix
        'chore', // Maintenance tasks
        'docs', // Documentation changes
        'test', // Test updates
        'refactor', // Code refactoring
        'ci', // CI/CD changes
        'build', // Build system changes
        'perf', // Performance improvements
        'revert', // Revert previous commit
      ],
    ],
    // Subject must not be empty
    'subject-empty': [2, 'never'],
    // Subject max length
    'subject-max-length': [2, 'always', 100],
    // Subject must not end with period
    'subject-full-stop': [2, 'never', '.'],
    // Type must be lowercase
    'type-case': [2, 'always', 'lower-case'],
    // Subject must be lowercase (sentence-case)
    'subject-case': [
      2,
      'never',
      ['sentence-case', 'start-case', 'pascal-case', 'upper-case'],
    ],
    // Body must have blank line before it
    'body-leading-blank': [1, 'always'],
    // Footer must have blank line before it
    'footer-leading-blank': [1, 'always'],
  },
}
