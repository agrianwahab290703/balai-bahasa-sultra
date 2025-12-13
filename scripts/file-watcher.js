const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const chokidar = require('chokidar');

class FileWatcher {
    constructor(options = {}) {
        this.options = {
            watchPaths: [
                'resources/js/**/*.tsx',
                'resources/js/**/*.ts',
                'resources/css/**/*.css',
                'resources/views/**/*.blade.php',
                'app/**/*.php'
            ],
            ignored: [
                '**/node_modules/**',
                '**/vendor/**',
                '**/public/build/**',
                '**/storage/logs/**'
            ],
            buildCommand: 'npm run build',
            debounceDelay: 500,
            ...options
        };
        
        this.isBuilding = false;
        this.buildQueue = [];
        this.watcher = null;
    }

    init() {
        console.log('🔍 Starting file watcher for auto-sync...');
        
        this.watcher = chokidar.watch(this.options.watchPaths, {
            ignored: this.options.ignored,
            persistent: true,
            ignoreInitial: true,
            usePolling: true,
            interval: 100
        });

        this.watcher
            .on('change', (filePath) => this.handleFileChange('changed', filePath))
            .on('add', (filePath) => this.handleFileChange('added', filePath))
            .on('unlink', (filePath) => this.handleFileChange('removed', filePath))
            .on('error', (error) => console.error(`❌ Watcher error: ${error}`));

        console.log('✅ File watcher initialized');
        console.log(`📁 Watching: ${this.options.watchPaths.join(', ')}`);
    }

    handleFileChange(action, filePath) {
        const relativePath = path.relative(process.cwd(), filePath);
        console.log(`📝 File ${action}: ${relativePath}`);
        
        this.queueBuild();
    }

    queueBuild() {
        if (this.isBuilding) {
            this.buildQueue.push(Date.now());
            return;
        }

        this.isBuilding = true;
        this.scheduleBuild();
    }

    scheduleBuild() {
        if (this.buildQueue.length > 0) {
            this.buildQueue = [];
        }

        setTimeout(() => {
            this.executeBuild();
        }, this.options.debounceDelay);
    }

    executeBuild() {
        console.log('🔨 Building application...');
        
        const startTime = Date.now();
        exec(this.options.buildCommand, (error, stdout, stderr) => {
            const endTime = Date.now();
            const duration = endTime - startTime;
            
            if (error) {
                console.error(`❌ Build failed (${duration}ms): ${error.message}`);
                if (stderr) console.error(stderr);
            } else {
                console.log(`✅ Build completed successfully (${duration}ms)`);
                this.notifyMobileUpdate();
            }
            
            this.isBuilding = false;
            
            if (this.buildQueue.length > 0) {
                this.scheduleBuild();
            }
        });
    }

    notifyMobileUpdate() {
        console.log('📱 Notifying mobile devices of update...');
        
        // Create a timestamp file to signal updates
        const timestampPath = path.join('public', 'build', '.sync-timestamp');
        const timestamp = Date.now().toString();
        
        try {
            fs.writeFileSync(timestampPath, timestamp);
            console.log('🔄 Sync timestamp updated');
        } catch (error) {
            console.error('❌ Failed to update sync timestamp:', error);
        }
    }

    stop() {
        if (this.watcher) {
            this.watcher.close();
            console.log('🛑 File watcher stopped');
        }
    }
}

// CLI interface
if (require.main === module) {
    const watcher = new FileWatcher();
    
    process.on('SIGINT', () => {
        console.log('\n🛑 Shutting down file watcher...');
        watcher.stop();
        process.exit(0);
    });
    
    process.on('SIGTERM', () => {
        console.log('\n🛑 Shutting down file watcher...');
        watcher.stop();
        process.exit(0);
    });
    
    watcher.init();
}

module.exports = FileWatcher;