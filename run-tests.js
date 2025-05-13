const { execSync } = require('child_process');

try {
  execSync('npx jest __tests__/password-utils.test.ts', { stdio: 'inherit' });
} catch (error) {
  console.error('Tests failed:', error);
  process.exit(1);
}