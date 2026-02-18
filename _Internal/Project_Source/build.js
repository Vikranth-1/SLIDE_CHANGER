const fs = require('fs');
const path = require('path');
const png2icons = require('png2icons');
const rcedit = require('rcedit');
const sharp = require('sharp');
const { execSync } = require('child_process');

async function build() {
    console.log('Building Slide Changer...');

    // 1. Convert PNG to ICO
    console.log('Converting logo to .ico...');
    try {
        // Resize to 256x256 first using sharp
        const resizedBuffer = await sharp('public/logo.png')
            .resize(256, 256)
            .png()
            .toBuffer();

        // Create standard Windows ICO
        const buf = png2icons.createICO(resizedBuffer, png2icons.BICUBIC2, 0, false, true);

        if (!buf) throw new Error('Failed to create ICO buffer');

        fs.writeFileSync('icon.ico', buf);
        console.log('Icon created: icon.ico');
    } catch (e) {
        console.error('Error creating icon:', e);
        return;
    }

    // 2. Run pkg to build exe
    console.log('Running pkg...');
    try {
        execSync('npx pkg . --targets node18-win-x64 --output slide-changer.exe', { stdio: 'inherit' });
    } catch (e) {
        console.error('Pkg build failed:', e);
        return;
    }

    // 3. Apply Icon with rcedit
    console.log('Applying icon to executable...');
    try {
        await rcedit('slide-changer.exe', {
            icon: 'icon.ico'
        });
        console.log('Success! Icon applied to slide-changer.exe');
    } catch (e) {
        console.error('Error setting icon:', e);
    }
}

build();
