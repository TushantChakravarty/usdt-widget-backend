import pino from 'pino'
import * as FileStreamRotator from 'file-stream-rotator'
import path from 'path'

process.env.TZ = "Asia/Kolkata" // set timezone

/** 
 * Create a rotating write stream for logging to files
 */
const log_stream = FileStreamRotator.getStream({
    filename: path.join(path.resolve(), '../logs', 'log-%DATE%'),
    frequency: 'daily',
    verbose: true,
    date_format: 'DD_MM_YYYY',
    size: "100M",
    extension: ".log",
    max_logs: 30,
    audit_file: path.join(path.resolve(), '../logs', 'audit.json'),
    create_symlink: true,
    symlink_name: "tail-current.log",
});

/**
 * Logger instance
 * @type {pino.Logger}
 */
const logger = pino({
    level: process.env.NODE_ENV === "production" ? "error" : "debug", // set log level
    stream: log_stream
});

export default logger;
