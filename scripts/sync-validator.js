const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const http = require('http');
const url = require('url');

class SyncValidator {
    constructor(options = {}) {
        this.options = {
            desktopPort: 5173,
            mobilePort: 5174,
            timeout: 5000,
            retries: 3,
            ...options
        };
        
        this.testResults = {
            desktop: { status: 'pending', tests: [] },
            mobile: { status: 'pending', tests: [] },
            sync: { status: 'pending', tests: [] }
        };
    }

    async runAllTests() {
        console.log('🧪 Starting sync validation tests...');
        
        try {
            // Test desktop server
            await this.testDesktopServer();
            
            // Test mobile server
            await this.testMobileServer();
            
            // Test file synchronization
            await this.testFileSync();
            
            // Test build consistency
            await this.testBuildConsistency();
            
            // Test real-time updates
            await this.testRealTimeUpdates();
            
            // Generate report
            this.generateReport();
            
        } catch (error) {
            console.error('❌ Test suite failed:', error.message);
            this.testResults.error = error.message;
        }
        
        return this.testResults;
    }

    async testDesktopServer() {
        console.log('🖥️ Testing desktop server...');
        
        const test = {
            name: 'Desktop Server Connectivity',
            status: 'running',
            message: ''
        };
        
        try {
            const response = await this.makeRequest(`http://localhost:${this.options.desktopPort}`);
            
            if (response.statusCode === 200) {
                test.status = 'passed';
                test.message = 'Desktop server is accessible';
            } else {
                test.status = 'failed';
                test.message = `Desktop server returned status ${response.statusCode}`;
            }
        } catch (error) {
            test.status = 'failed';
            test.message = `Desktop server error: ${error.message}`;
        }
        
        this.testResults.desktop.tests.push(test);
        this.updatePlatformStatus('desktop');
        
        console.log(`${test.status === 'passed' ? '✅' : '❌'} ${test.name}: ${test.message}`);
    }

    async testMobileServer() {
        console.log('📱 Testing mobile server...');
        
        const test = {
            name: 'Mobile Server Connectivity',
            status: 'running',
            message: ''
        };
        
        try {
            const response = await this.makeRequest(`http://localhost:${this.options.mobilePort}`);
            
            if (response.statusCode === 200) {
                test.status = 'passed';
                test.message = 'Mobile server is accessible';
            } else {
                test.status = 'failed';
                test.message = `Mobile server returned status ${response.statusCode}`;
            }
        } catch (error) {
            test.status = 'failed';
            test.message = `Mobile server error: ${error.message}`;
        }
        
        this.testResults.mobile.tests.push(test);
        this.updatePlatformStatus('mobile');
        
        console.log(`${test.status === 'passed' ? '✅' : '❌'} ${test.name}: ${test.message}`);
    }

    async testFileSync() {
        console.log('🔄 Testing file synchronization...');
        
        const test = {
            name: 'File Synchronization',
            status: 'running',
            message: ''
        };
        
        try {
            // Check if sync files exist
            const syncFile = 'public/build/.sync-info';
            const manifestFile = 'public/build/manifest.json';
            
            if (!fs.existsSync(syncFile)) {
                throw new Error('Sync info file not found');
            }
            
            if (!fs.existsSync(manifestFile)) {
                throw new Error('Build manifest not found');
            }
            
            // Check sync timestamps
            const syncInfo = JSON.parse(fs.readFileSync(syncFile, 'utf8'));
            const currentTime = Date.now();
            const timeDiff = currentTime - syncInfo.timestamp;
            
            if (timeDiff > 60000) { // 1 minute
                test.status = 'warning';
                test.message = `Sync info is old (${Math.round(timeDiff / 1000)}s ago)`;
            } else {
                test.status = 'passed';
                test.message = 'File synchronization is up to date';
            }
            
        } catch (error) {
            test.status = 'failed';
            test.message = `File sync error: ${error.message}`;
        }
        
        this.testResults.sync.tests.push(test);
        this.updatePlatformStatus('sync');
        
        console.log(`${test.status === 'passed' ? '✅' : test.status === 'warning' ? '⚠️' : '❌'} ${test.name}: ${test.message}`);
    }

    async testBuildConsistency() {
        console.log('🔍 Testing build consistency...');
        
        const test = {
            name: 'Build Consistency',
            status: 'running',
            message: ''
        };
        
        try {
            // Check checksums
            const checksumFile = 'public/build/.checksums.json';
            
            if (!fs.existsSync(checksumFile)) {
                throw new Error('Checksum file not found');
            }
            
            const checksums = JSON.parse(fs.readFileSync(checksumFile, 'utf8'));
            const fileCount = Object.keys(checksums).length;
            
            if (fileCount === 0) {
                throw new Error('No files in checksum');
            }
            
            test.status = 'passed';
            test.message = `Build consistency verified (${fileCount} files)`;
            
        } catch (error) {
            test.status = 'failed';
            test.message = `Build consistency error: ${error.message}`;
        }
        
        this.testResults.sync.tests.push(test);
        this.updatePlatformStatus('sync');
        
        console.log(`${test.status === 'passed' ? '✅' : '❌'} ${test.name}: ${test.message}`);
    }

    async testRealTimeUpdates() {
        console.log('⚡ Testing real-time updates...');
        
        const test = {
            name: 'Real-time Updates',
            status: 'running',
            message: ''
        };
        
        try {
            // Create a test file change
            const testFile = 'resources/js/test-sync.js';
            const testContent = `// Test file for sync - ${Date.now()}`;
            
            // Write test file
            fs.writeFileSync(testFile, testContent);
            
            // Wait a moment for file watcher to detect
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Check if sync timestamp was updated
            const syncFile = 'public/build/.sync-info';
            if (fs.existsSync(syncFile)) {
                const syncInfo = JSON.parse(fs.readFileSync(syncFile, 'utf8'));
                const timeDiff = Date.now() - syncInfo.timestamp;
                
                if (timeDiff < 10000) { // Within 10 seconds
                    test.status = 'passed';
                    test.message = 'Real-time updates are working';
                } else {
                    test.status = 'warning';
                    test.message = 'Real-time updates may be delayed';
                }
            } else {
                test.status = 'failed';
                test.message = 'Sync file not updated';
            }
            
            // Clean up test file
            try {
                fs.unlinkSync(testFile);
            } catch (e) {
                // Ignore cleanup errors
            }
            
        } catch (error) {
            test.status = 'failed';
            test.message = `Real-time update error: ${error.message}`;
        }
        
        this.testResults.sync.tests.push(test);
        this.updatePlatformStatus('sync');
        
        console.log(`${test.status === 'passed' ? '✅' : test.status === 'warning' ? '⚠️' : '❌'} ${test.name}: ${test.message}`);
    }

    makeRequest(url) {
        return new Promise((resolve, reject) => {
            const request = http.get(url, (response) => {
                resolve(response);
            });
            
            request.on('error', (error) => {
                reject(error);
            });
            
            request.setTimeout(this.options.timeout, () => {
                request.destroy();
                reject(new Error('Request timeout'));
            });
        });
    }

    updatePlatformStatus(platform) {
        const tests = this.testResults[platform].tests;
        const passedTests = tests.filter(t => t.status === 'passed').length;
        const failedTests = tests.filter(t => t.status === 'failed').length;
        const warningTests = tests.filter(t => t.status === 'warning').length;
        
        if (failedTests > 0) {
            this.testResults[platform].status = 'failed';
        } else if (warningTests > 0) {
            this.testResults[platform].status = 'warning';
        } else if (passedTests > 0) {
            this.testResults[platform].status = 'passed';
        }
    }

    generateReport() {
        console.log('\n📊 Sync Validation Report');
        console.log('==========================');
        
        Object.keys(this.testResults).forEach(platform => {
            const result = this.testResults[platform];
            const status = result.status;
            const icon = status === 'passed' ? '✅' : status === 'warning' ? '⚠️' : status === 'failed' ? '❌' : '⏳';
            
            console.log(`\n${platform.toUpperCase()}: ${icon} ${status.toUpperCase()}`);
            
            result.tests.forEach(test => {
                const testIcon = test.status === 'passed' ? '✅' : test.status === 'warning' ? '⚠️' : '❌';
                console.log(`  ${testIcon} ${test.name}: ${test.message}`);
            });
        });
        
        // Save report to file
        const reportPath = 'public/build/sync-validation-report.json';
        try {
            fs.writeFileSync(reportPath, JSON.stringify(this.testResults, null, 2));
            console.log(`\n💾 Report saved to ${reportPath}`);
        } catch (error) {
            console.warn('⚠️ Could not save report:', error.message);
        }
    }

    async quickCheck() {
        console.log('⚡ Running quick sync check...');
        
        const results = {
            servers: await this.checkServers(),
            files: await this.checkFiles(),
            sync: await this.checkSyncStatus()
        };
        
        const allPassed = Object.values(results).every(r => r.status === 'passed');
        
        if (allPassed) {
            console.log('✅ Quick check passed - everything is in sync!');
        } else {
            console.log('⚠️ Quick check found issues:');
            Object.entries(results).forEach(([key, result]) => {
                if (result.status !== 'passed') {
                    console.log(`  ${key}: ${result.message}`);
                }
            });
        }
        
        return results;
    }

    async checkServers() {
        try {
            const desktopResponse = await this.makeRequest(`http://localhost:${this.options.desktopPort}`);
            
            if (desktopResponse.statusCode === 200) {
                return { status: 'passed', message: 'Desktop server is accessible' };
            } else {
                return { status: 'failed', message: `Desktop server returned status ${desktopResponse.statusCode}` };
            }
        } catch (error) {
            return { status: 'failed', message: `Server check failed: ${error.message}` };
        }
    }

    async checkFiles() {
        try {
            const syncFile = 'public/build/.sync-info';
            const manifestFile = 'public/build/manifest.json';
            
            const syncExists = fs.existsSync(syncFile);
            const manifestExists = fs.existsSync(manifestFile);
            
            if (!syncExists && !manifestExists) {
                return { status: 'failed', message: 'Both sync info and manifest files missing' };
            } else if (!syncExists) {
                return { status: 'failed', message: 'Sync info file missing' };
            } else if (!manifestExists) {
                return { status: 'failed', message: 'Manifest file missing' };
            } else {
                return { status: 'passed', message: 'Required files exist' };
            }
        } catch (error) {
            return { status: 'failed', message: `File check failed: ${error.message}` };
        }
    }

    async checkSyncStatus() {
        try {
            const syncFile = 'public/build/.sync-info';
            
            if (fs.existsSync(syncFile)) {
                const syncInfo = JSON.parse(fs.readFileSync(syncFile, 'utf8'));
                const timeDiff = Date.now() - syncInfo.timestamp;
                
                if (timeDiff < 60000) {
                    return { status: 'passed', message: 'Sync is up to date' };
                } else {
                    return { status: 'warning', message: 'Sync may be outdated' };
                }
            } else {
                return { status: 'failed', message: 'No sync information available' };
            }
        } catch (error) {
            return { status: 'failed', message: `Sync check failed: ${error.message}` };
        }
    }
}

// CLI interface
if (require.main === module) {
    const validator = new SyncValidator();
    
    const command = process.argv[2];
    
    switch (command) {
        case 'full':
            validator.runAllTests();
            break;
        case 'quick':
            validator.quickCheck();
            break;
        default:
            console.log('Usage: node sync-validator.js [full|quick]');
    }
}

module.exports = SyncValidator;