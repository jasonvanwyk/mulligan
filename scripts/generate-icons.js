const fs = require('fs');
const path = require('path');

// Create a simple SVG icon with the letter "M"
const createSVGIcon = (size) => `
<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#4f46e5"/>
  <text x="50%" y="50%" font-family="Arial" font-size="${size/2}" fill="white" text-anchor="middle" dy="${size/6}">M</text>
</svg>
`;

// Ensure the public directory exists
const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}

// Generate SVG icons
const sizes = [16, 32, 64, 192, 512];
sizes.forEach(size => {
  const svg = createSVGIcon(size);
  fs.writeFileSync(path.join(publicDir, `icon-${size}.svg`), svg);
});

console.log('Icons generated successfully!'); 