const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'fields.json');
let content = fs.readFileSync(filePath, 'utf8');

// Replace color paths
content = content.replace(/theme\.global_colors\.primary\.color/g, 'theme.brand_colors.brand_green.color');
content = content.replace(/theme\.global_colors\.secondary\.color/g, 'theme.brand_colors.brand_lime.color');

// Replace font paths
content = content.replace(/theme\.global_fonts\.primary/g, 'theme.typography.sans');
content = content.replace(/theme\.global_fonts\.secondary/g, 'theme.typography.display');

fs.writeFileSync(filePath, content, 'utf8');
console.log('fields.json updated successfully!');
