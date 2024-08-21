/**
 * Build and compilation script using esbuild.
 * Configures and executes the build process for the application.
 * @file esbuild.js
 * @module esbuild
 * @category compiler
 */

import fs from 'fs-extra';
import { build } from 'esbuild';
import { pnpPlugin } from '@yarnpkg/esbuild-plugin-pnp';
// import { aliasPath } from 'esbuild-plugin-alias-path';
import chokidar from 'chokidar';
import { spawn } from 'child_process';

let serverProcess = null; // Variable to keep track of the server process

/** 
 * Function to bundle the code using esbuild
 */
async function bundle() {
    const isDevelopment = process.env.NODE_ENV === 'development';

    // Build the code using esbuild
    await build({
        entryPoints: ['./src/app.js'],
        outdir: './build',
        platform: 'node',
        format: 'esm',
        target: 'node18',
        bundle: true,
        minify: !isDevelopment,
        sourcemap: isDevelopment,
        legalComments: 'none',
        external: [
            '@fastify/swagger',
            '@fastify/swagger-ui',
        ],
        banner: {
            js: `
            "use strict";
            const { require, __filename, __dirname } = await (async () => {
                const { createRequire } = await import("node:module");
                const { fileURLToPath } = await import("node:url");

                return {
                    require: createRequire(import.meta.url),
                    __filename: fileURLToPath(import.meta.url),
                    __dirname: fileURLToPath(new URL(".", import.meta.url)),
                };
            })();`
        },
        plugins: [
            // aliasPath({
            //     alias: {
            //         'src': './src',
            //         'controllers': './src/controllers',
            //         'models': './src/models',
            //         'middlewares': './src/middlewares',
            //         'services': './src/services',
            //         'plugins': './src/plugins',
            //         'routes': './src/routes',
            //         'utils': './src/utils',
            //     },
            // }),
            pnpPlugin(),
        ],
    });

    // Copy static files to the build directory
    copyStaticFiles();
}

/** 
 * Function to clean the build directory before starting the bundling
 */
async function cleanBuildDirectory() {
    try {
        await fs.emptyDir('./build');
    } catch (err) {
        console.error(err);
    }
}

/**
 * Function to start the development server
 */
function startServer() {
    console.log('Starting the server...');
    if (serverProcess) {
        serverProcess.kill(); // Terminate the previous server process
    }
    serverProcess = spawn('node', ['./build/app.js'], { stdio: 'inherit' });

    serverProcess.on('error', (err) => {
        console.error('Error starting the server:', err);
    });

    console.log('Server started.');
}


/** 
 * Copy static files to the build directory
 */
function copyStaticFiles() {
    // copy folder node_modules/@fastify/swagger-ui/static -> build/static
    fs.copy('./node_modules/@fastify/swagger-ui/static', './build/static', (err) => {
        if (err) {
            console.error('Error copying static files: ', err);
        }
    });
}

/** 
 * Clean the build directory
 */
await cleanBuildDirectory();

// Start the bundling process
bundle().then(() => {
    if (process.env.NODE_ENV === 'development') {
        startServer();
    }
}).catch((err) => {
    console.error('Build failed:', err);
    process.exit(1);
});

/**
 * In development, watch for file changes in the './src' directory and rebuild the code
 */
if (process.env.NODE_ENV === 'development') {
    const watcher = chokidar.watch('./src');
    watcher.on('change', async (path) => {
        console.log(`File ${path} changed. Rebuilding...`);
        cleanBuildDirectory();
        await bundle();
        startServer(); // Re-Start the server
        console.log('Rebuild complete.');
    });
}