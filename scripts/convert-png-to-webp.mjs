import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const IMAGES_DIR = path.resolve('public/images');

async function convertPngsToWebp() {
  if (!fs.existsSync(IMAGES_DIR)) {
    console.error('Directory not found:', IMAGES_DIR);
    process.exit(1);
  }

  const files = fs.readdirSync(IMAGES_DIR);
  const pngFiles = files.filter((f) => f.toLowerCase().endsWith('.png'));

  for (const file of pngFiles) {
    const inputPath = path.join(IMAGES_DIR, file);
    const outputPath = path.join(
      IMAGES_DIR,
      `${path.basename(file, path.extname(file))}.webp`
    );

    try {
      await sharp(inputPath).webp({ quality: 82 }).toFile(outputPath);
      console.log('Converted to webp:', file, '->', path.basename(outputPath));
    } catch (err) {
      console.error('Failed to convert', file, err);
      process.exitCode = 1;
    }
  }
}

convertPngsToWebp();


