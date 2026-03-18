const fs = require('fs');
const path = require('path');

console.log('🔧 IDENTIFYING ALL MOCK DATA IN FRONTEND...');

const pagesDir = path.join(__dirname, '../frontend/src/pages');

// Find all files with mock data
const filesWithMockData = [];

function scanDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      scanDirectory(fullPath);
    } else if (file.endsWith('.js')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      
      // Check for mock data patterns
      const hasMockData = content.includes('mock') || 
                         content.includes('Mock') ||
                         content.includes('const.*=.*\\[') ||
                         content.includes('hardcoded') ||
                         (content.includes('[{') && content.includes('id:'));
      
      if (hasMockData) {
        filesWithMockData.push({
          file: fullPath.replace(pagesDir, ''),
          content: content,
          hasMockData: true
        });
        console.log(`📄 Found mock data in: ${file}`);
      }
    }
  }
}

scanDirectory(pagesDir);

console.log(`\n📊 SUMMARY:`);
console.log(`Total files with mock data: ${filesWithMockData.length}`);

console.log('\n🎯 FILES TO FIX:');
filesWithMockData.forEach(file => {
  console.log(`  - ${file.file}`);
});

console.log('\n⚡  NEXT STEPS:');
console.log('1. Replace mock arrays with real API calls');
console.log('2. Use api.get() instead of hardcoded data');
console.log('3. Connect to actual database endpoints');
console.log('4. Add loading states and error handling');

console.log('\n✅ PRIORITY FILES (Most Critical):');
const priorityFiles = filesWithMockData.filter(f => 
  f.file.includes('Seller') || 
  f.file.includes('Customer') || 
  f.file.includes('Admin')
);

priorityFiles.forEach(file => {
  console.log(`  - ${file.file} (HIGH PRIORITY)`);
});

process.exit(0);
