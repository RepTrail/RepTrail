const fs = require('fs');
const report = JSON.parse(fs.readFileSync('lint_report.json', 'utf8'));

const violations = [];

report.forEach(file => {
  file.messages.forEach(msg => {
    if (msg.ruleId === 'no-restricted-syntax') {
      violations.push({
        file: file.filePath,
        line: msg.line,
        message: msg.message
      });
    }
  });
});

console.log(JSON.stringify(violations, null, 2));
