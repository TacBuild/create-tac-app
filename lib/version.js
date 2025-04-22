import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Get the current version of the package
 * @returns {string} The package version
 */
export function getVersion() {
  const packageJsonPath = path.resolve(__dirname, '../package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  return packageJson.version;
}

/**
 * Log the current version of the package
 */
export function logVersion() {
  console.log(`create-tac-app v${getVersion()}`);
} 