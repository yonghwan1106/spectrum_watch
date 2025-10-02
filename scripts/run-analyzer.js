const { spawn } = require('child_process');
const path = require('path');

const scriptPath = path.join(__dirname, 'analyze-all-data.ts');

console.log('Starting AI analysis...\n');

const child = spawn('npx', ['tsx', scriptPath], {
  stdio: 'inherit',
  shell: true,
});

child.on('error', (error) => {
  console.error('Failed to start analyzer:', error);
  process.exit(1);
});

child.on('close', (code) => {
  if (code === 0) {
    console.log('\n✅ Analysis completed successfully!');
  } else {
    console.error(`\n❌ Analysis failed with code ${code}`);
  }
  process.exit(code);
});
