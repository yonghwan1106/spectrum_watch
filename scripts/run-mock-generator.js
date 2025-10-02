const { spawn } = require('child_process');
const path = require('path');

// Run the TypeScript file with tsx
const scriptPath = path.join(__dirname, 'generate-mock-data.ts');
const count = process.argv[2] || '50';

console.log('Starting mock data generator...');
console.log(`Generating ${count} entries...\n`);

const child = spawn('npx', ['tsx', scriptPath, count], {
  stdio: 'inherit',
  shell: true,
});

child.on('error', (error) => {
  console.error('Failed to start mock data generator:', error);
  process.exit(1);
});

child.on('close', (code) => {
  if (code === 0) {
    console.log('\nMock data generation completed successfully!');
  } else {
    console.error(`\nMock data generation failed with code ${code}`);
  }
  process.exit(code);
});
