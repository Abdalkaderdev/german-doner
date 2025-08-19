import { promises as fs } from 'fs';
import path from 'path';
import { promisify } from 'util';
import { execFile } from 'child_process';
import sharp from 'sharp';

const execFileAsync = promisify(execFile);

const IMAGES_DIR = './public/images';
const OUTPUT_DIR = './public/images/optimized';
const TMP_DIR = './public/images/.tmp_jxl';

const QUALITY = {
	webp: 80,
	jpg: 85,
};

const SIZES = {
	thumbnail: 150,
	small: 300,
	medium: 600,
	large: 1200,
};

async function ensureDir(dir) {
	try {
		await fs.access(dir);
	} catch {
		await fs.mkdir(dir, { recursive: true });
	}
}

async function optimizeFromFile(inputPath, baseName) {
	// Generate WebP at various sizes
	for (const [sizeName, size] of Object.entries(SIZES)) {
		const outputPath = path.join(OUTPUT_DIR, `${baseName}-${sizeName}.webp`);
		await sharp(inputPath)
			.resize(size, null, { fit: 'inside', withoutEnlargement: true })
			.webp({ quality: QUALITY.webp })
			.toFile(outputPath);
		console.log(`  ✓ ${path.basename(outputPath)}`);
	}
	// Full size WebP
	const fullWebp = path.join(OUTPUT_DIR, `${baseName}.webp`);
	await sharp(inputPath).webp({ quality: QUALITY.webp }).toFile(fullWebp);
	console.log(`  ✓ ${path.basename(fullWebp)}`);
	// JPG fallback (~800px)
	const jpgFallback = path.join(OUTPUT_DIR, `${baseName}.jpg`);
	await sharp(inputPath)
		.resize(800, null, { fit: 'inside', withoutEnlargement: true })
		.jpeg({ quality: QUALITY.jpg })
		.toFile(jpgFallback);
	console.log(`  ✓ ${path.basename(jpgFallback)}`);
}

async function convertSingleJxl(jxlPath) {
	const baseName = path.basename(jxlPath, path.extname(jxlPath));
	const tmpPng = path.join(TMP_DIR, `${baseName}.png`);
	console.log(`\nDecoding ${path.basename(jxlPath)} -> ${path.basename(tmpPng)}`);
	try {
		await execFileAsync('djxl', [jxlPath, tmpPng]);
	} catch (err) {
		if (err?.code === 'ENOENT' || /not recognized|not found/i.test(String(err))) {
			console.error('✗ The "djxl" decoder is not installed or not in PATH.');
			console.error('  Please install JPEG XL tools (djxl) and try again:');
			console.error('  Windows: download binaries from `https://github.com/libjxl/libjxl/releases` and add to PATH');
			console.error('  Or install via package manager if available.');
			throw new Error('djxl not available');
		}
		throw err;
	}
	await optimizeFromFile(tmpPng, baseName);
	// Cleanup temp file
	try { await fs.unlink(tmpPng); } catch {}
}

async function main() {
	await ensureDir(OUTPUT_DIR);
	await ensureDir(TMP_DIR);
	const files = await fs.readdir(IMAGES_DIR);
	const jxlFiles = files.filter(f => path.extname(f).toLowerCase() === '.jxl');
	if (jxlFiles.length === 0) {
		console.log('No .jxl files found.');
		return;
	}
	console.log(`Found ${jxlFiles.length} .jxl files`);
	for (const file of jxlFiles) {
		const jxlPath = path.join(IMAGES_DIR, file);
		await convertSingleJxl(jxlPath);
	}
	console.log('\nDone converting .jxl images. Output in public/images/optimized');
}

main().catch(err => {
	process.exitCode = 1;
});


