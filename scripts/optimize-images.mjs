import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';

const IMAGES_DIR = './public/images';
const NEW_DIR = './public/new';
const OUTPUT_DIR = './public/images/optimized';

// Quality settings for different image types
const QUALITY = {
  webp: 80,
  jpg: 85,
  png: 90
};

// Sizes for responsive images
const SIZES = {
  thumbnail: 150,
  small: 300,
  medium: 600,
  large: 1200
};

async function ensureDir(dir) {
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }
}

async function optimizeImage(inputPath, outputPath, width, height, quality, format) {
  try {
    const image = sharp(inputPath);
    
    if (width || height) {
      image.resize(width, height, {
        fit: 'inside',
        withoutEnlargement: true
      });
    }
    
    switch (format) {
      case 'webp':
        await image.webp({ quality }).toFile(outputPath);
        break;
      case 'jpg':
        await image.jpeg({ quality }).toFile(outputPath);
        break;
      case 'png':
        await image.png({ quality }).toFile(outputPath);
        break;
      default:
        await image.toFile(outputPath);
    }
    
    const stats = await fs.stat(outputPath);
    const originalStats = await fs.stat(inputPath);
    const savings = ((originalStats.size - stats.size) / originalStats.size * 100).toFixed(1);
    
    console.log(`✓ ${path.basename(outputPath)} - ${(stats.size / 1024).toFixed(1)}KB (${savings}% smaller)`);
    
    return { success: true, size: stats.size, savings };
  } catch (error) {
    console.error(`✗ Error processing ${inputPath}:`, error.message);
    return { success: false, error: error.message };
  }
}

async function processImage(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const name = path.basename(filePath, ext);
  const isImage = ['.jpg', '.jpeg', '.png', '.webp', '.tif', '.tiff'].includes(ext);
  
  if (!isImage) return;
  
  // Check if file exists before processing
  try {
    await fs.access(filePath);
  } catch {
    console.log(`⚠️  Skipping ${path.basename(filePath)} - file not found`);
    return;
  }
  
  // Check if already optimized by looking for the main WebP file
  const mainWebpPath = path.join(OUTPUT_DIR, `${name}.webp`);
  try {
    await fs.access(mainWebpPath);
    console.log(`⏭️  Skipping ${path.basename(filePath)} - already optimized`);
    return;
  } catch {
    // File doesn't exist, proceed with optimization
  }
  
  console.log(`\nProcessing: ${path.basename(filePath)}`);
  
  // Skip if already optimized
  if (filePath.includes('/optimized/')) return;
  
  const results = [];
  
  // Generate WebP versions at different sizes
  for (const [sizeName, size] of Object.entries(SIZES)) {
    const outputPath = path.join(OUTPUT_DIR, `${name}-${sizeName}.webp`);
    const result = await optimizeImage(filePath, outputPath, size, null, QUALITY.webp, 'webp');
    if (result.success) results.push(result);
  }
  
  // Generate high-quality WebP for full-size
  const fullSizeWebp = path.join(OUTPUT_DIR, `${name}.webp`);
  await optimizeImage(filePath, fullSizeWebp, null, null, QUALITY.webp, 'webp');
  
  // Generate JPG fallback for older browsers
  const jpgFallback = path.join(OUTPUT_DIR, `${name}.jpg`);
  await optimizeImage(filePath, jpgFallback, 800, null, QUALITY.jpg, 'jpg');
  
  return results;
}

async function walkDir(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (fullPath.includes('/optimized')) continue;
      const nested = await walkDir(fullPath);
      files.push(...nested);
    } else {
      files.push(fullPath);
    }
  }
  return files;
}

async function main() {
  console.log('🚀 Starting image optimization...\n');
  
  await ensureDir(OUTPUT_DIR);
  
  // Process both images and new directories
  const imagesFiles = await walkDir(IMAGES_DIR);
  const newFiles = await walkDir(NEW_DIR);
  const allFiles = [...imagesFiles, ...newFiles];
  
  const imageFiles = allFiles.filter(file => {
    const ext = path.extname(file).toLowerCase();
    return ['.jpg', '.jpeg', '.png', '.webp', '.tif', '.tiff'].includes(ext);
  });
  
  console.log(`Found ${imageFiles.length} images to process\n`);
  
  let totalOriginalSize = 0;
  let totalOptimizedSize = 0;
  let processedCount = 0;
  let skippedCount = 0;
  
  for (const filePath of imageFiles) {
    const stats = await fs.stat(filePath);
    totalOriginalSize += stats.size;
    
    const results = await processImage(filePath);
    if (results) {
      processedCount++;
      results.forEach(result => {
        totalOptimizedSize += result.size;
      });
    } else {
      skippedCount++;
    }
  }
  
  const totalSavings = ((totalOriginalSize - totalOptimizedSize) / totalOriginalSize * 100).toFixed(1);
  
  console.log(`\n🎉 Optimization complete!`);
  console.log(`Processed: ${processedCount} images`);
  console.log(`Skipped (already optimized): ${skippedCount} images`);
  console.log(`Original size: ${(totalOriginalSize / 1024 / 1024).toFixed(1)}MB`);
  console.log(`Optimized size: ${(totalOptimizedSize / 1024 / 1024).toFixed(1)}MB`);
  console.log(`Total savings: ${totalSavings}%`);
  console.log(`\nOptimized images saved to: ${OUTPUT_DIR}`);
}

main().catch(console.error);
