// scripts/upload-images.js
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

cloudinary.config({
  cloud_name: 'dj7hg86pg',
  api_key: '341573895174242',
  api_secret: process.env.CLOUDINARY_API_SECRET
});

async function uploadImages() {
  const publicDir = './public';
  
  // Check if public directory exists
  if (!fs.existsSync(publicDir)) {
    console.log('❌ Public directory not found');
    return;
  }

  // Get all image files
  const files = fs.readdirSync(publicDir).filter(file => 
    file.match(/\.(jpg|jpeg|png|gif|webp)$/i)
  );

  if (files.length === 0) {
    console.log('ℹ️  No image files found in public directory');
    return;
  }

  console.log(`📸 Found ${files.length} images to upload:`);
  files.forEach(file => console.log(`   - ${file}`));

  for (const file of files) {
    const filePath = path.join(publicDir, file);
    const publicId = path.parse(file).name; // filename without extension
    
    try {
      console.log(`⬆️  Uploading ${file} as "${publicId}"...`);
      const result = await cloudinary.uploader.upload(filePath, {
        public_id: publicId,
        overwrite: true,
        quality: 'auto',
        fetch_format: 'auto'
      });
      console.log(`✅ Uploaded "${publicId}" - ${result.secure_url}`);
    } catch (error) {
      console.error(`❌ Failed to upload ${file}:`, error.message);
      process.exit(1); // Fail the build if upload fails
    }
  }
  
  console.log('🎉 All images uploaded successfully!');
}

// Check if API secret is provided
if (!process.env.CLOUDINARY_API_SECRET) {
  console.error('❌ CLOUDINARY_API_SECRET environment variable is required');
  process.exit(1);
}

uploadImages().catch(error => {
  console.error('💥 Upload failed:', error);
  process.exit(1);
});
