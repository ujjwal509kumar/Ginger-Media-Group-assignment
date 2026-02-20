import mongoose from 'mongoose';

const MONGODB_URI = process.env.DATABASE_URL;

let cached = globalThis.mongoose ?? { conn: null, promise: null };
globalThis.mongoose = cached;

export async function connectDB() {
    if (cached.conn) return cached.conn;
    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI).then(m => m);
    }
    cached.conn = await cached.promise;
    return cached.conn;
}