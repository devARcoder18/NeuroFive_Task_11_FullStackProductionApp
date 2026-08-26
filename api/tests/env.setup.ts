// Runs before any test file is imported, so config/env.ts has values to read
// before mongodb-memory-server hands back the real in-memory connection string.
process.env.JWT_SECRET = "test-secret";
process.env.MONGODB_URI = "mongodb://127.0.0.1:27017/focusflow-test-placeholder";
process.env.CLIENT_ORIGIN = "http://localhost:3000";
