// This script creates simple gradient icons for the extension
// Run with: node create-icons.js

const fs = require('fs');
const { createCanvas } = require('canvas');

function createIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Gradient background
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, '#FF6B9D');
  gradient.addColorStop(0.5, '#C850C0');
  gradient.addColorStop(1, '#FFCC70');

  // Rounded rectangle
  const radius = size * 0.2;
  ctx.beginPath();
  ctx.roundRect(0, 0, size, size, radius);
  ctx.fillStyle = gradient;
  ctx.fill();

  // Sparkle
  ctx.fillStyle = 'white';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `bold ${size * 0.5}px Arial`;
  ctx.fillText('GZ', size/2, size/2);

  return canvas.toBuffer('image/png');
}

// Create icons
[16, 48, 128].forEach(size => {
  const buffer = createIcon(size);
  fs.writeFileSync(`icon${size}.png`, buffer);
  console.log(`Created icon${size}.png`);
});

console.log('Icons created successfully!');
