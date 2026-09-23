module.exports = {
    // Keep this secret out of source control in production - use an environment variable
    secret: process.env.JWT_SECRET || 'your-dev-only-secret-change-me',
    // Token expiry, e.g. 24 hours
    expiresIn: process.env.JWT_EXPIRES_IN || '24h'
}
