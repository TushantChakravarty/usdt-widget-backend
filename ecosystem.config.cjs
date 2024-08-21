const { execSync } = require('child_process');
const os = require('os');

// Function to get the current git branch name
function getCurrentBranch() {
    try {
        return execSync('git symbolic-ref --short HEAD')
            .toString().trim();
    } catch (err) {
        console.error('Failed to get branch name:', err);
        return 'main';  // Default to 'main' if branch name can't be fetched
    }
}

const branchName = getCurrentBranch(); //   Get the current branch name

// Define branch-based configurations
const branchConfigs = {
    main: {
        cwd: '/home/ubuntu/Main',
        args: ':prod -- --port 3000',
    },
    staging: {
        cwd: '/home/ubuntu/Staging',
        args: ':prod -- --port 3001',
    },
    dev: {
        cwd: '/home/ubuntu/Dev',
        args: ':server -- --port 3002',
    },
    qa: {
        cwd: '/home/ubuntu/Qa',
        args: ':server -- --port 3003',
    },
};

// Fetch the configuration for the current branch
const currentConfig = branchConfigs[branchName];

if (!currentConfig) {
    throw new Error(`No configuration found for branch: ${branchName}`);
}

// Export the PM2 configuration
module.exports = {
    apps: [
        {
            name: `play999_${branchName}`,
            cwd: currentConfig.cwd,
            script: './build/app.js',
            args: currentConfig.args,
            instances: os.cpus().length,  // Utilize all CPU cores
            exec_mode: 'cluster',  // Run in cluster mode
            watch: false,  // Restart the app on file changes. Set to true for development
            node_args: '--max-old-space-size=2048',  // Increase memory limit
            max_memory_restart: '384M',  // Restart the app if it exceeds 512MB memory usage
        },
    ],
};