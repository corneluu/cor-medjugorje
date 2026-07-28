const { execSync } = require('child_process');

try {
  console.log('Staging files...');
  execSync('git add index.html assets/ vite.config.ts', { stdio: 'inherit' });

  console.log('Committing...');
  execSync('git commit -m "build: output production bundle to main root for GitHub Pages"', { stdio: 'inherit' });

  console.log('Pushing to GitHub...');
  execSync('git push origin main', { stdio: 'inherit' });

  console.log('✅ Successfully pushed root build to main!');
} catch (err) {
  console.error('Error during git deployment:', err.message);
}
