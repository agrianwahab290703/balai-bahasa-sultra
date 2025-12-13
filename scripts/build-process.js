const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { exec } = require('child_process');

class BuildProcess {
    constructor(options = {}) {
        this.options = {
            buildDir: 'public/build',
            assetsDir: 'public/assets',
            manifestFile: 'public/build/manifest.json',
            syncFile: 'public/build/.sync-info',
            checksumFile: 'public/build/.checksums.json',
            ...options
        };
        
        this.buildInfo = {
            timestamp: null,
            checksum: null,
            platform: null,
            version: null
        };
    }

    async init() {
        console.log('🔧 Initializing build process...');
        
        // Ensure build directories exist
        this.ensureDirectories();
        
        // Load previous build info
        this.loadBuildInfo();
        
        console.log('✅ Build process initialized');
    }

    ensureDirectories() {
        const dirs = [
            this.options.buildDir,
            this.options.assetsDir,
            path.dirname(this.options.manifestFile)
        ];
        
        dirs.forEach(dir => {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
                console.log(`📁 Created directory: ${dir}`);
            }
        });
    }

    loadBuildInfo() {
        try {
            if (fs.existsSync(this.options.syncFile)) {
                const data = fs.readFileSync(this.options.syncFile, 'utf8');
                this.buildInfo = JSON.parse(data);
                console.log('📋 Loaded previous build info');
            }
        } catch (error) {
            console.warn('⚠️ Could not load build info:', error.message);
        }
    }

    async build(platform = 'desktop') {
        console.log(`🔨 Building for ${platform}...`);
        
        const startTime = Date.now();
        
        try {
            // Execute build command
            await this.executeBuild();
            
            // Generate checksums
            const checksum = await this.generateChecksums();
            
            // Update build info
            this.buildInfo = {
                timestamp: Date.now(),
                checksum,
                platform,
                version: this.getVersion()
            };
            
            // Save build info
            this.saveBuildInfo();
            
            // Generate sync manifest
            this.generateSyncManifest();
            
            const duration = Date.now() - startTime;
            console.log(`✅ Build completed for ${platform} (${duration}ms)`);
            
            return {
                success: true,
                duration,
                checksum,
                platform
            };
            
        } catch (error) {
            console.error(`❌ Build failed for ${platform}:`, error.message);
            return {
                success: false,
                error: error.message,
                platform
            };
        }
    }

    executeBuild() {
        return new Promise((resolve, reject) => {
            exec('npm run build', (error, stdout, stderr) => {
                if (error) {
                    reject(new Error(`Build command failed: ${error.message}`));
                } else {
                    resolve(stdout);
                }
            });
        });
    }

    async generateChecksums() {
        const checksums = {};
        const files = this.getBuildFiles();
        
        for (const file of files) {
            try {
                const content = fs.readFileSync(file, 'utf8');
                const hash = crypto.createHash('md5').update(content).digest('hex');
                checksums[path.relative(process.cwd(), file)] = hash;
            } catch (error) {
                console.warn(`⚠️ Could not checksum ${file}:`, error.message);
            }
        }
        
        // Save checksums
        try {
            fs.writeFileSync(this.options.checksumFile, JSON.stringify(checksums, null, 2));
        } catch (error) {
            console.warn('⚠️ Could not save checksums:', error.message);
        }
        
        return crypto.createHash('md5').update(JSON.stringify(checksums)).digest('hex');
    }

    getBuildFiles() {
        const files = [];
        
        // Get files from manifest
        try {
            if (fs.existsSync(this.options.manifestFile)) {
                const manifest = JSON.parse(fs.readFileSync(this.options.manifestFile, 'utf8'));
                Object.values(manifest).forEach(entry => {
                    if (entry.file) {
                        files.push(path.join('public', entry.file));
                    }
                });
            }
        } catch (error) {
            console.warn('⚠️ Could not read manifest:', error.message);
        }
        
        return files;
    }

    saveBuildInfo() {
        try {
            fs.writeFileSync(this.options.syncFile, JSON.stringify(this.buildInfo, null, 2));
            console.log('💾 Saved build info');
        } catch (error) {
            console.error('❌ Could not save build info:', error.message);
        }
    }

    generateSyncManifest() {
        const manifest = {
            buildInfo: this.buildInfo,
            files: this.getBuildFiles(),
            syncEndpoints: {
                desktop: `http://localhost:5173`,
                mobile: `http://localhost:5174`
            },
            lastSync: Date.now()
        };
        
        try {
            fs.writeFileSync(
                path.join(this.options.buildDir, 'sync-manifest.json'),
                JSON.stringify(manifest, null, 2)
            );
            console.log('📋 Generated sync manifest');
        } catch (error) {
            console.error('❌ Could not generate sync manifest:', error.message);
        }
    }

    getVersion() {
        try {
            const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
            return packageJson.version || '1.0.0';
        } catch (error) {
            return '1.0.0';
        }
    }

    async validateBuild(platform) {
        console.log(`🔍 Validating build for ${platform}...`);
        
        const issues = [];
        
        // Check if build files exist
        const files = this.getBuildFiles();
        if (files.length === 0) {
            issues.push('No build files found');
        }
        
        // Check manifest
        if (!fs.existsSync(this.options.manifestFile)) {
            issues.push('Build manifest not found');
        }
        
        // Check sync info
        if (!fs.existsSync(this.options.syncFile)) {
            issues.push('Sync info not found');
        }
        
        // Validate checksums
        try {
            const currentChecksum = await this.generateChecksums();
            if (currentChecksum !== this.buildInfo.checksum) {
                issues.push('Checksum mismatch - build may be incomplete');
            }
        } catch (error) {
            issues.push(`Checksum validation failed: ${error.message}`);
        }
        
        if (issues.length > 0) {
            console.error(`❌ Build validation failed for ${platform}:`);
            issues.forEach(issue => console.error(`  - ${issue}`));
            return { valid: false, issues };
        }
        
        console.log(`✅ Build validation passed for ${platform}`);
        return { valid: true };
    }

    async syncPlatforms() {
        console.log('🔄 Syncing platforms...');
        
        const desktopResult = await this.build('desktop');
        if (!desktopResult.success) {
            throw new Error(`Desktop build failed: ${desktopResult.error}`);
        }
        
        const mobileResult = await this.build('mobile');
        if (!mobileResult.success) {
            throw new Error(`Mobile build failed: ${mobileResult.error}`);
        }
        
        // Validate both builds
        const desktopValidation = await this.validateBuild('desktop');
        const mobileValidation = await this.validateBuild('mobile');
        
        if (!desktopValidation.valid || !mobileValidation.valid) {
            throw new Error('Platform validation failed');
        }
        
        console.log('✅ Platform sync completed');
        return {
            desktop: desktopResult,
            mobile: mobileResult
        };
    }
}

// CLI interface
if (require.main === module) {
    const buildProcess = new BuildProcess();
    
    const command = process.argv[2];
    const platform = process.argv[3] || 'desktop';
    
    buildProcess.init().then(() => {
        switch (command) {
            case 'build':
                buildProcess.build(platform);
                break;
            case 'validate':
                buildProcess.validateBuild(platform);
                break;
            case 'sync':
                buildProcess.syncPlatforms();
                break;
            default:
                console.log('Usage: node build-process.js [build|validate|sync] [platform]');
        }
    }).catch(error => {
        console.error('❌ Build process error:', error.message);
        process.exit(1);
    });
}

module.exports = BuildProcess;